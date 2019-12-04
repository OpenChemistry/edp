import requests
import os
import pathlib
import json
from bson.objectid import ObjectId
import boto3
import click
from urllib.parse import urlparse
import functools


def get(url, token=None, **kwargs):
    headers = kwargs.setdefault('headers', {})

    if token is not None:
        headers['Girder-Token'] = token

    return requests.get(url, **kwargs)

def extract_url(api_url, token, s3_bucket, s3_bucket_prefix, path, update=None):
    api_path = os.path.join(api_url, path)
    click.echo(click.style('Downloading: %s' % api_path, fg='green'))
    r = get(api_path, token)

    s3_path = os.path.join(s3_bucket_prefix, path)
    click.echo(click.style('Uploading to S3: %s' % s3_path, fg='yellow'))

    content = r.content
    if update is not None and callable(update):
        content = update(content)

    s3_bucket.put_object(Key=s3_path, Body=content, ContentType='application/json')

    # Now extract any files we need to upload
    doc = r.json()
    if isinstance(doc, dict):
        extract_files(api_url, token, s3_bucket, s3_bucket_prefix, doc)

def upload_file(api_url, token, s3_bucket, s3_bucket_prefix, file_id):
    file_url = '%s/file/%s' % (api_url, file_id)
    file_download_url = '%s/download' % file_url
    click.echo(click.style('Downloading: %s' % file_download_url, fg='green'))
    r = get(file_download_url, token,  allow_redirects=False)

    s3_file_download_url_key = '%s/file/%s/download' % (s3_bucket_prefix, file_id)
    click.echo(click.style('Uploading to S3: %s' % s3_file_download_url_key, fg='yellow'))

    if 'Location' in r.headers:
        # Need to remove the presigned bit
        s3_url = r.headers['Location'].split('?')[0]
        s3_url = urlparse(s3_url).path
        s3_url = '/%s' % s3_url.split('/', 2)[2]
        s3_bucket.put_object(Key=s3_file_download_url_key, Body=b'',
                        WebsiteRedirectLocation=s3_url)
    else:
        s3_bucket.put_object(Key=s3_file_download_url_key, Body=r.content)

    click.echo(click.style('Downloading: %s' % file_url, fg='green'))
    r = get(file_url, token)
    s3_file_url_key = '%s/file/%s' % (s3_bucket_prefix, file_id)
    click.echo(click.style('Uploading to S3: %s' % s3_file_url_key, fg='yellow'))
    s3_bucket.put_object(Key=s3_file_url_key, Body=r.content, ContentType='application/json')

def extract_files(api_url, token, s3_bucket, s3_bucket_prefix, item):
    for key in item:
        if key.endswith('FileId'):
            file_id = item[key]
            upload_file(api_url, token, s3_bucket, s3_bucket_prefix, file_id)

def extract_path(api_url, token, s3_bucket, s3_bucket_prefix, path, hierarchy):
    api_path = os.path.join(api_url, path)
    click.echo(click.style('Downloading: %s' % api_path, fg='green'))
    r = get(api_path, token)

    s3_path = os.path.join(s3_bucket_prefix, path)
    click.echo(click.style('Uploading to S3: %s' % s3_path, fg='yellow'))
    s3_bucket.put_object(Key=s3_path, Body=r.content, ContentType='application/json')

    doc = r.json()
    if isinstance(doc, list):
        for item in doc:
            if '_id' in item:
                # Note we strip of any query parameters
                new_path = os.path.join(urlparse(path).path, item['_id'])
                extract_path(api_url, token, s3_bucket, s3_bucket_prefix, new_path, hierarchy)
            extract_files(api_url, token, s3_bucket, s3_bucket_prefix, item)
    else:
        extract_files(api_url, token, s3_bucket, s3_bucket_prefix, doc)

    try:
        if ObjectId(os.path.basename(path)):
            children = hierarchy[0]
            if not isinstance(children, (list, tuple)):
                children = (children,)

            # If we have any functions call them
            child_paths = []
            try:
                for c in children:
                    if callable(c):
                        child_paths += c(functools.partial(get, token=token), api_path)
                    else:
                        child_paths.append(c)
            except:
                import traceback
                traceback.print_exc()
                raise

            for c in child_paths:
                extract_path(api_url, token, s3_bucket, s3_bucket_prefix,
                            os.path.join(path, c), hierarchy[1:])
    except:
        pass

def _update_static(content):
    content = json.loads(content)
    content['static'] = True
    content = json.dumps(content).encode()

    return content

def extract_misc(api_url, token, s3_bucket, s3_bucket_prefix):
    extract_url(api_url, token, s3_bucket, s3_bucket_prefix, 'user/me')
    extract_url(api_url, token, s3_bucket, s3_bucket_prefix, 'edp/configuration', update=_update_static)

    api_path = os.path.join(api_url, 'oauth/provider?redirect=dummy')
    click.echo(click.style('Downloading: %s' % api_path, fg='green'))
    r = get(api_path, token)

    s3_path = os.path.join(s3_bucket_prefix, 'oauth/provider')
    click.echo(click.style('Uploading to S3: %s' % s3_path, fg='yellow'))

    r = s3_bucket.put_object(Key=s3_path, Body=r.content, ContentType='application/json')

def deploy(api_url, api_root, children, s3_bucket, s3_bucket_prefix, key=None):
    token = None
    if key is not None:
        auth_url = '%s/api_key/token' % api_url
        r = requests.post(auth_url, params={
            'key': key
        })

        token = r.json()['authToken']['token']

    s3 = boto3.resource('s3')
    bucket = s3.Bucket(s3_bucket)
    s3_bucket_prefix = '%s%s' % (s3_bucket_prefix, urlparse(api_url).path)
    extract_path(api_url, token, bucket, s3_bucket_prefix, api_root, children)
    try:
        extract_misc(api_url, token, bucket, s3_bucket_prefix)
    except:
        import traceback
        traceback.print_exc()
