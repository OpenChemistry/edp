import click
import os
import glob
import re
import csv
import types
import sys
import datetime
from girder_client import GirderClient

class GC(GirderClient):

    def __init__(self, api_url=None, api_key=None):

        def _progress_bar(*args, **kwargs):
            bar = click.progressbar(*args, **kwargs)
            bar.bar_template = "[%(bar)s]  %(info)s  %(label)s"
            bar.show_percent = True
            bar.show_pos = True

            def formatSize(length):
                if length == 0:
                    return '%.2f' % length
                unit = ''
                # See https://en.wikipedia.org/wiki/Binary_prefix
                units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
                while True:
                    if length <= 1024 or len(units) == 0:
                        break
                    unit = units.pop(0)
                    length /= 1024.
                return '%.2f%s' % (length, unit)

            def formatPos(_self):
                pos = formatSize(_self.pos)
                if _self.length_known:
                    pos += '/%s' % formatSize(_self.length)
                return pos

            bar.format_pos = types.MethodType(formatPos, bar)
            return bar

        _progress_bar.reportProgress = sys.stdout.isatty()

        super(GC, self).__init__(
            apiUrl=api_url, progressReporterCls=_progress_bar)

        self.authenticate(apiKey=api_key)

@click.group()
def cli():
    pass

@cli.command('ingest', help='Ingest data')
@click.option('-p', '--project', default=None, help='the project id', required=True)
@click.option('-c', '--cycle', default=None, help='the cycle id', required=True)
@click.option('-d', '--dir', help='path to batch to ingest',
              type=click.Path(exists=True, dir_okay=True, file_okay=False, readable=True), default='.')
@click.option('-u', '--api-url', default='http://localhost:8080/api/v1', help='RESTful API URL '
                   '(e.g https://girder.example.com/api/v1)')
@click.option('-k', '--api-key', envvar='GIRDER_API_KEY', default=None,
              help='[default: GIRDER_API_KEY env. variable]', required=True)
def _ingest(project, cycle, api_url, api_key, dir):
    gc = GC(api_url=api_url, api_key=api_key)

    # Try to get edp data folder
    data_folder = gc.resourceLookup('/collection/edp/data')

    # Create a private folder
    if data_folder is None:

        me = gc.get('/user/me')
        private_folder = next(gc.listFolder(me['_id'], 'user', 'Private'))

        data_folder = gc.listFolder(private_folder['_id'], 'folder', name='edp')
        try:
            data_folder = next(data_folder)
        except StopIteration:
            data_folder = gc.createFolder(private_folder['_id'], 'edp', parentType='folder',
                                          public=False)

    dir  = os.path.abspath(dir)
    batch_name = os.path.basename(dir)

    # Create the batch
    batch = {
        'startDate': '',
        'title': batch_name,
        'motivation': '',
        'experimentalDesign': '',
        'experimentalNotes': '',
        'dataNotes': ''
    }

    batch = gc.post('edp/projects/%s/cycles/%s/batches' % (project, cycle), json=batch)
    metafile_regex =  re.compile(r'^\d{4}-\d{2}-\d{2}_.*_CH(\d)+_Metadata.csv$')
    for meta_file in glob.glob('%s/*Metadata.csv' % dir):
        name = os.path.basename(meta_file)
        match = metafile_regex.match(name)
        if match is None:
            click.echo(click.style('%s does not have expected filename format, skipping.' % meta_file, fg='yellow'))
            continue

        channel = match.group(1)
        data_file = meta_file.replace('_Metadata.csv', '.csv')

        with open(meta_file, 'r') as f:
            reader = csv.DictReader(f)
            row = next(reader)
            start_date = row['first_start_datetime']
            start_date = datetime.datetime.fromtimestamp(int(start_date)).strftime('%Y-%m-%d')
            cell_id = row['item_id']
            schedule_file = row['schedule_file_name']

        click.echo('Uploading meta data file')
        meta_file = gc.uploadFileToFolder(data_folder['_id'], meta_file)
        click.echo('Uploading data file')
        data_file = gc.uploadFileToFolder(data_folder['_id'], data_file)

        test = {
            'startDate': start_date,
            'cellId': cell_id,
            'batteryType': '',
            'channel': channel,
            'scheduleFile': schedule_file,
            'metaDataFileId': meta_file['_id'],
            'dataFileId': data_file['_id']
        }

        test = gc.post('edp/projects/%s/cycles/%s/batches/%s/tests' % (project, cycle, batch['_id']), json=test)

        click.echo(click.style('Test created: %s' % test['_id'], fg='green'))


