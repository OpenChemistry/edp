import pytest
import datetime
import json
from pytest_girder.assertions import assertStatus, assertStatusOk


@pytest.mark.plugin('edp')
def test_create_public(server, user, batch_request, experiment):
    from girder.plugins.edp.models.batch import Batch

    r = server.request('/edp/experiments/%s/batches' % experiment['_id'],
                       method='POST', body=json.dumps(batch_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    batch = Batch().load(r.json['_id'], force=True)

    assert batch['owner'] == user['_id']
    assert batch_request.items() <= batch.items()


@pytest.mark.plugin('edp')
def test_create_private(server, user, batch_request, experiment):
    from girder.plugins.edp.models.batch import Batch

    r = server.request('/edp/experiments/%s/batches' % experiment['_id'],
                       method='POST', body=json.dumps(batch_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    batch = Batch().load(r.json['_id'], force=True)
    assert batch_request.items() <= batch.items()


@pytest.mark.plugin('edp')
def test_update(server, user, experiment, batch):
    from girder.plugins.edp.models.batch import Batch

    updates = {
        'title': 'Nothing to see here.',
        'dataNotes': 'Notes'
    }

    r = server.request('/edp/experiments/%s/batches/%s' % (experiment['_id'], batch['_id']),
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatusOk(r)

    batch = Batch().load(r.json['_id'], force=True)
    assert updates.items() <= batch.items()


@pytest.mark.plugin('edp')
def test_update_non_existent(server, user, experiment, batch):
    from girder.plugins.edp.models.batch import Batch

    updates = {
        'title': 'Nothing to see here.',
        'dataNotes': 'Notes'
    }

    non_existent = '5ae71e1ff657102b11ce2233'
    r = server.request('/edp/experiments/%s/batches/%s' % (experiment['_id'], non_existent),
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatus(r, 400)


@pytest.mark.plugin('edp')
def test_delete(server, user, experiment, batch):
    from girder.plugins.edp.models.batch import Batch

    r = server.request('/edp/experiments/%s/batches/%s' % (experiment['_id'], batch['_id']),
                       method='DELETE', user=user)
    assertStatusOk(r)

    batch = Batch().load(batch['_id'], force=True)
    assert batch is None

@pytest.mark.plugin('edp')
def test_find(server, user, experiment, batch):
    r = server.request('/edp/experiments/%s/batches' % experiment['_id'],
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_find_owner(server, user, admin, experiment, batch):
    from girder.plugins.edp.models.batch import Batch

    params = {
        'owner': admin['_id']
    }

    r = server.request('/edp/experiments/%s/batches' % experiment['_id'],
                       params=params, method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 0

    params['owner'] = user['_id']
    r = server.request('/edp/experiments/%s/batches' % experiment['_id'],
                       params=params, method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_get(server, user, admin, experiment, batch):
    r = server.request('/edp/experiments/%s/batches/%s' % (experiment['_id'], batch['_id']),
                       method='GET', user=user)
    assertStatusOk(r)
    assert batch.items() <= r.json.items()

