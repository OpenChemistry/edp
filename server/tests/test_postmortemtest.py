import pytest
import datetime
import json
from pytest_girder.assertions import assertStatus, assertStatusOk


@pytest.mark.plugin('edp')
def test_create_public(server, user, postmortem,  create_postmortemtest_request, postmortemtest):
    from girder.plugins.edp.models.postmortemtest import PostmortemTest

    postmortemtest = PostmortemTest().load(postmortemtest['_id'], force=True)
    assert postmortemtest['owner'] == user['_id']
    assert str(postmortemtest['postmortemId']) == postmortem['_id']
    assert create_postmortemtest_request.items() <= postmortemtest.items()

@pytest.mark.plugin('edp')
def test_create_private(server, user, project, postmortem, create_postmortemtest_request):
    from girder.plugins.edp.models.postmortemtest import PostmortemTest

    create_postmortemtest_request['public'] = False
    r = server.request('/edp/projects/%s/postmortems/%s/tests' % (project['_id'], postmortem['_id']),
                        method='POST', body=json.dumps(create_postmortemtest_request),
                        type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    test = PostmortemTest().load(r.json['_id'], force=True)
    assert str(test['postmortemId']) == postmortem['_id']
    assert create_postmortemtest_request.items() <= test.items()


@pytest.mark.plugin('edp')
def test_update(server, user, project, postmortem, make_postmortem,
                postmortemtest, fsAssetstore, make_girder_file):
    from girder.plugins.edp.models.postmortemtest import PostmortemTest

    image_file = make_girder_file(fsAssetstore, user, 'image')

    updates = {
        'imageFileId': image_file['_id'],
        'comments': 'We now have files.'
    }
    r = server.request('/edp/projects/%s/postmortems/%s/tests/%s' % (project['_id'], postmortem['_id'], postmortemtest['_id']),
                       method='PATCH', body=json.dumps({k:str(v) for (k,v) in updates.items()}),
                       type='application/json', user=user)
    assertStatusOk(r)

    postmortemtest = PostmortemTest().load(r.json['_id'], force=True)
    assert updates.items() <= postmortemtest.items()

    # Try to patch a postmortemtest not associated with a give project
    body = {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'comment': 'another comment'
    }
    another_project = make_postmortem(user, project, body)
    r = server.request('/edp/projects/%s/postmortems/%s/tests/%s' % (another_project['_id'],
                                                                    postmortem['_id'], postmortemtest['_id']),
                       method='PATCH', body=json.dumps({k:str(v) for (k,v) in updates.items()}),
                       type='application/json', user=user)
    assertStatus(r, 400)

@pytest.mark.plugin('edp')
def test_delete(server, user, project, postmortem, postmortemtest):
    from girder.plugins.edp.models.postmortemtest import PostmortemTest

    r = server.request('/edp/projects/%s/postmortems/%s/tests/%s' % (project['_id'], postmortem['_id'], postmortemtest['_id']),
                        method='DELETE', user=user)
    assertStatusOk(r)

    postmortemtest = PostmortemTest().load(postmortemtest['_id'], force=True)
    assert postmortemtest is None

@pytest.mark.plugin('edp')
def test_delete_with_file(server, user, project, postmortem, postmortemtest, make_girder_file,
                          fsAssetstore):
    from girder.plugins.edp.models.postmortemtest import PostmortemTest
    from girder.models.file import File

    image_file = make_girder_file(fsAssetstore, user, 'data')

    updates = {
        'imageFileId': image_file['_id'],
        'comments': 'We now have files.'
    }
    r = server.request('/edp/projects/%s/postmortems/%s/tests/%s' % (project['_id'], postmortem['_id'], postmortemtest['_id']),
                       method='PATCH', body=json.dumps({k:str(v) for (k,v) in updates.items()}),
                       type='application/json', user=user)
    assertStatusOk(r)

    r = server.request('/edp/projects/%s/postmortems/%s/tests/%s' % (project['_id'], postmortem['_id'], postmortemtest['_id']),
                        method='DELETE', user=user)
    assertStatusOk(r)

    postmortemtest = PostmortemTest().load(postmortemtest['_id'], force=True)
    assert postmortemtest is None


    image_file = File().load(image_file['_id'], force=True)
    assert image_file is None


@pytest.mark.plugin('edp')
def test_find(server, user, project, postmortem,  postmortemtest):
    r = server.request('/edp/projects/%s/postmortems/%s/tests' % (project['_id'], postmortem['_id']),
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1
    assert postmortemtest.items() <= r.json[0].items()

@pytest.mark.plugin('edp')
def test_get(server, project, postmortem, make_postmortem, user, admin, postmortemtest):
    r = server.request('/edp/projects/%s/postmortems/%s/tests/%s' % (project['_id'],
                                                                    postmortem['_id'], postmortemtest['_id']),
                       method='GET', user=user)
    assertStatusOk(r)
    assert postmortemtest.items() <= r.json.items()

    # Make another project and try to fetch a postmortemtest that is not associated
    # with it
    body = {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'another title',
        'experimentalDesign': 'I designed the cool experiment.',
        'experimentalNotes': 'These are my notes.',
        'dataNotes': 'Here are some notes.',
        'motivation': 'I have some.'
    }
    another_postmortem = make_postmortem(user, project, body)
    r = server.request('/edp/projects/%s/postmortems/%s/tests/%s' % (project['_id'], another_postmortem['_id'], postmortemtest['_id']),
                       method='GET', user=user)
    assertStatus(r, 400)
