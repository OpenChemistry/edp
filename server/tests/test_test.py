import pytest
import datetime
import json
from pytest_girder.assertions import assertStatus, assertStatusOk


@pytest.fixture
def create_test_request():
    yield {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'cellId': 'cell',
        'channel': '2',
        'comments': 'comments',
        'public': True
    }

@pytest.fixture
def test(server, user, experiment, create_test_request):
    from girder.plugins.edp.models.test import Test

    r = server.request('/edp/experiments/%s/tests' % experiment['_id'],
                       method='POST', body=json.dumps(create_test_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    yield r.json

    Test().remove(r.json, force=True)

@pytest.mark.plugin('edp')
def test_create_public(server, user, experiment, create_test_request, test):
    from girder.plugins.edp.models.test import Test

    test = Test().load(test['_id'], force=True)
    assert test['owner'] == user['_id']
    assert str(test['experimentId']) == experiment['_id']
    assert create_test_request.items() <= test.items()


@pytest.mark.plugin('edp')
def test_create_private(server, user, experiment, create_test_request):
    from girder.plugins.edp.models.test import Test

    create_test_request['public'] = False
    r = server.request('/edp/experiments/%s/tests' % experiment['_id'],
                        method='POST', body=json.dumps(create_test_request),
                        type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    test = Test().load(r.json['_id'], force=True)
    assert str(test['experimentId']) == experiment['_id']
    assert create_test_request.items() <= test.items()


@pytest.mark.plugin('edp')
def test_update(server, user, experiment, make_experiment,
                test, fsAssetstore, make_girder_file):
    from girder.plugins.edp.models.test import Test

    schedule_file = make_girder_file(fsAssetstore, user, 'schedule')
    metadata_file = make_girder_file(fsAssetstore, user, 'meta')
    data_file = make_girder_file(fsAssetstore, user, 'data')
    from girder.models.file import File

    updates = {
        'scheduleFileId': schedule_file['_id'],
        'metaDataFileId': metadata_file['_id'],
        'dataFileId': data_file['_id'],
        'comments': 'We now have files.'
    }
    r = server.request('/edp/experiments/%s/tests/%s' % (experiment['_id'], test['_id']),
                       method='PATCH', body=json.dumps({k:str(v) for (k,v) in updates.items()}),
                       type='application/json', user=user)
    assertStatusOk(r)

    test = Test().load(r.json['_id'], force=True)
    assert updates.items() <= test.items()

    # Try to patch a test not associated with a give experiment
    body = {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'another title',
        'experimentalDesign': 'I designed the cool experiment.',
        'experimentalNotes': 'These are my notes.',
        'dataNotes': 'Here are some notes.',
        'motivation': 'I have lots'
    }
    another_experiment = make_experiment(user, body)
    r = server.request('/edp/experiments/%s/tests/%s' % (another_experiment['_id'], test['_id']),
                       method='PATCH', body=json.dumps({k:str(v) for (k,v) in updates.items()}),
                       type='application/json', user=user)
    assertStatus(r, 400)

@pytest.mark.plugin('edp')
def test_delete(server, user, experiment, test):
    from girder.plugins.edp.models.test import Test

    r = server.request('/edp/experiments/%s/tests/%s' % (experiment['_id'], test['_id']),
                        method='DELETE', user=user)
    assertStatusOk(r)
#
    test = Test().load(experiment['_id'], force=True)
    assert test is None

@pytest.mark.plugin('edp')
def test_find(server, user, experiment, test):
    r = server.request('/edp/experiments/%s/tests' % experiment['_id'],
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1
    assert test.items() <= r.json[0].items()

@pytest.mark.plugin('edp')
def test_get(server, make_experiment, user, admin, experiment, test):
    r = server.request('/edp/experiments/%s/tests/%s' % (experiment['_id'], test['_id']),
                       method='GET', user=user)
    assertStatusOk(r)
    assert test.items() <= r.json.items()

    # Make another experiment and try to fetch a test that is not associated
    # with it
    body = {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'another title',
        'experimentalDesign': 'I designed the cool experiment.',
        'experimentalNotes': 'These are my notes.',
        'dataNotes': 'Here are some notes.',
        'motivation': 'I have some.'
    }
    another_experiment = make_experiment(user, body)
    r = server.request('/edp/experiments/%s/tests/%s' % (another_experiment['_id'], test['_id']),
                       method='GET', user=user)
    assertStatus(r, 400)
