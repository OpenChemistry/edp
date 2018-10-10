import pytest
import datetime
import json
from pytest_girder.assertions import assertStatus, assertStatusOk


@pytest.mark.plugin('edp')
def test_create_public(server, user, batch, create_cycletest_request, cycletest):
    from girder.plugins.edp.models.cycletest import CycleTest

    test = CycleTest().load(cycletest['_id'], force=True)
    assert test['owner'] == user['_id']
    assert str(test['batchId']) == batch['_id']
    assert create_cycletest_request.items() <= test.items()

@pytest.mark.plugin('edp')
def test_create_private(server, user, project, cycle, batch, create_cycletest_request):
    from girder.plugins.edp.models.cycletest import CycleTest

    create_cycletest_request['public'] = False
    r = server.request('/edp/projects/%s/cycles/%s/batches/%s/tests' % (project['_id'], cycle['_id'], batch['_id']),
                        method='POST', body=json.dumps(create_cycletest_request),
                        type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    test = CycleTest().load(r.json['_id'], force=True)
    assert str(test['batchId']) == batch['_id']
    assert create_cycletest_request.items() <= test.items()


@pytest.mark.plugin('edp')
def test_update(server, user, project, cycle, batch, make_batch,
                cycletest, fsAssetstore, make_girder_file):
    from girder.plugins.edp.models.cycletest import CycleTest

    metadata_file = make_girder_file(fsAssetstore, user, 'meta')
    data_file = make_girder_file(fsAssetstore, user, 'data')

    updates = {
        'metaDataFileId': metadata_file['_id'],
        'dataFileId': data_file['_id'],
        'comments': 'We now have files.'
    }
    r = server.request('/edp/projects/%s/cycles/%s/batches/%s/tests/%s' % (project['_id'], cycle['_id'], batch['_id'], cycletest['_id']),
                       method='PATCH', body=json.dumps({k:str(v) for (k,v) in updates.items()}),
                       type='application/json', user=user)
    assertStatusOk(r)

    test = CycleTest().load(r.json['_id'], force=True)
    assert updates.items() <= test.items()

    # Try to patch a test not associated with a give project
    body = {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'another title',
        'experimentalDesign': 'I designed the cool experiment.',
        'experimentalNotes': 'These are my notes.',
        'dataNotes': 'Here are some notes.',
        'motivation': 'I have lots'
    }
    another_project = make_batch(user, project, cycle, body)
    r = server.request('/edp/projects/%s/cycles/%s/batches/%stests/%s' % (another_project['_id'], cycle['_id'],
                                                                    batch['_id'], test['_id']),
                       method='PATCH', body=json.dumps({k:str(v) for (k,v) in updates.items()}),
                       type='application/json', user=user)
    assertStatus(r, 400)

@pytest.mark.plugin('edp')
def test_delete(server, user, project, cycle, batch, cycletest):
    from girder.plugins.edp.models.cycletest import CycleTest

    r = server.request('/edp/projects/%s/cycles/%s/batches/%s/tests/%s' % (project['_id'], cycle['_id'], batch['_id'], cycletest['_id']),
                        method='DELETE', user=user)
    assertStatusOk(r)

    test = CycleTest().load(cycletest['_id'], force=True)
    assert test is None

@pytest.mark.plugin('edp')
def test_delete_with_file(server, user, project, cycle, batch, cycletest, make_girder_file,
                          fsAssetstore):
    from girder.plugins.edp.models.cycletest import CycleTest
    from girder.models.file import File

    metadata_file = make_girder_file(fsAssetstore, user, 'meta')
    data_file = make_girder_file(fsAssetstore, user, 'data')

    updates = {
        'metaDataFileId': metadata_file['_id'],
        'dataFileId': data_file['_id'],
        'comments': 'We now have files.'
    }
    r = server.request('/edp/projects/%s/cycles/%s/batches/%s/tests/%s' % (
            project['_id'], cycle['_id'], batch['_id'], cycletest['_id']),
            method='PATCH', body=json.dumps({k:str(v) for (k,v) in updates.items()}),
            type='application/json', user=user)
    assertStatusOk(r)

    r = server.request('/edp/projects/%s/cycles/%s/batches/%s/tests/%s' % (
            project['_id'], cycle['_id'], batch['_id'],  cycletest['_id']),
            method='DELETE', user=user)
    assertStatusOk(r)

    cycletest = CycleTest().load(cycletest['_id'], force=True)
    assert cycletest is None


    metadata_file =  File().load(metadata_file['_id'], force=True)
    assert metadata_file is None

    data_file = File().load(data_file['_id'], force=True)
    assert data_file is None


@pytest.mark.plugin('edp')
def test_find(server, user, project, cycle, batch, cycletest):
    r = server.request('/edp/projects/%s/cycles/%s/batches/%s/tests' % (
            project['_id'], cycle['_id'], batch['_id']),
            method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1
    assert cycletest.items() <= r.json[0].items()

@pytest.mark.plugin('edp')
def test_get(server, project, cycle, batch, make_batch, user, admin, cycletest):
    r = server.request('/edp/projects/%s/cycles/%s/batches/%s/tests/%s' % (
            project['_id'], cycle['_id'], batch['_id'], cycletest['_id']),
            method='GET', user=user)
    assertStatusOk(r)
    assert cycletest.items() <= r.json.items()

    # Make another project and try to fetch a test that is not associated
    # with it
    body = {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'another title',
        'experimentalDesign': 'I designed the cool experiment.',
        'experimentalNotes': 'These are my notes.',
        'dataNotes': 'Here are some notes.',
        'motivation': 'I have some.'
    }
    another_batch = make_batch(user, project, cycle, body)
    r = server.request('/edp/projects/%s/cycles/%s/batches/%s/tests/%s' % (
            project['_id'], cycle['_id'], another_batch['_id'], cycletest['_id']),
            method='GET', user=user)
    assertStatus(r, 400)
