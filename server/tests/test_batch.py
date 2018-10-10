import pytest
import datetime
import json
from pytest_girder.assertions import assertStatus, assertStatusOk


@pytest.mark.plugin('edp')
def test_create_public(server, user, project, cycle, batch_request):
    from girder.plugins.edp.models.batch import Batch

    r = server.request('/edp/projects/%s/cycles/%s/batches' % (project['_id'], cycle['_id']),
                       method='POST', body=json.dumps(batch_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    batch = Batch().load(r.json['_id'], force=True)

    assert batch['owner'] == user['_id']
    assert batch_request.items() <= batch.items()


@pytest.mark.plugin('edp')
def test_create_private(server, user, project, cycle, batch_request):
    from girder.plugins.edp.models.batch import Batch

    r = server.request('/edp/projects/%s/cycles/%s/batches' % (project['_id'], cycle['_id']),
                       method='POST', body=json.dumps(batch_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    batch = Batch().load(r.json['_id'], force=True)
    assert batch_request.items() <= batch.items()


@pytest.mark.plugin('edp')
def test_update(server, user, project, cycle, batch):
    from girder.plugins.edp.models.batch import Batch

    updates = {
        'title': 'Nothing to see here.',
        'dataNotes': 'Notes'
    }

    r = server.request('/edp/projects/%s/cycles/%s/batches/%s' % (project['_id'], cycle['_id'], batch['_id']),
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatusOk(r)

    batch = Batch().load(r.json['_id'], force=True)
    assert updates.items() <= batch.items()


@pytest.mark.plugin('edp')
def test_update_non_existent(server, user, project, cycle, batch):
    from girder.plugins.edp.models.batch import Batch

    updates = {
        'title': 'Nothing to see here.',
        'dataNotes': 'Notes'
    }

    non_existent = '5ae71e1ff657102b11ce2233'
    r = server.request('/edp/projects/%s/cycles/%s/batches/%s' % (project['_id'], cycle['_id'], non_existent),
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatus(r, 400)


@pytest.mark.plugin('edp')
def test_delete(server, user, project, cycle, batch):
    from girder.plugins.edp.models.batch import Batch

    r = server.request('/edp/projects/%s/cycles/%s/batches/%s' % (project['_id'], cycle['_id'], batch['_id']),
                       method='DELETE', user=user)
    assertStatusOk(r)

    batch = Batch().load(batch['_id'], force=True)
    assert batch is None

@pytest.mark.plugin('edp')
def test_delete_with_test(server, user, project, cycle, batch, cycletest):
    from girder.plugins.edp.models.batch import Batch
    from girder.plugins.edp.models.cycletest import CycleTest

    r = server.request('/edp/projects/%s/cycles/%s/batches/%s' % (project['_id'], cycle['_id'], batch['_id']),
                       method='DELETE', user=user)
    assertStatusOk(r)

    batch = Batch().load(batch['_id'], force=True)
    assert batch is None

    cycletest = CycleTest().load(cycletest['_id'], force=True)
    assert cycletest is None

@pytest.mark.plugin('edp')
def test_find(server, user, project, cycle, batch):
    r = server.request('/edp/projects/%s/cycles/%s/batches' % (project['_id'], cycle['_id']),
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_find_owner(server, user, admin, project, cycle, batch):
    from girder.plugins.edp.models.batch import Batch

    params = {
        'owner': admin['_id']
    }

    r = server.request('/edp/projects/%s/cycles/%s/batches' % (project['_id'], cycle['_id']),
                       params=params, method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 0

    params['owner'] = user['_id']
    r = server.request('/edp/projects/%s/cycles/%s/batches' % (project['_id'], cycle['_id']),
                       params=params, method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_get(server, user, admin, project, cycle, batch):
    r = server.request('/edp/projects/%s/cycles/%s/batches/%s' % (project['_id'], cycle['_id'], batch['_id']),
                       method='GET', user=user)
    assertStatusOk(r)
    assert batch.items() <= r.json.items()

