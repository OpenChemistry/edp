import pytest
import datetime
import json
from pytest_girder.assertions import assertStatus, assertStatusOk


@pytest.mark.plugin('edp')
def test_create_public(server, user, experiment_request):
    from girder.plugins.edp.models.experiment import Experiment

    r = server.request('/edp/experiments', method='POST', body=json.dumps(experiment_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    experiment = Experiment().load(r.json['_id'], force=True)
    assert experiment['owner'] == user['_id']
    assert experiment_request.items() <= experiment.items()


@pytest.mark.plugin('edp')
def test_create_private(server, user, experiment_request):
    from girder.plugins.edp.models.experiment import Experiment

    experiment_request['public'] = False
    r = server.request('/edp/experiments', method='POST', body=json.dumps(experiment_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    experiment = Experiment().load(r.json['_id'], force=True)
    assert experiment_request.items() <= experiment.items()


@pytest.mark.plugin('edp')
def test_update(server, user, experiment):
    from girder.plugins.edp.models.experiment import Experiment

    updates = {
        'title': 'Nothing to see here.'
    }

    r = server.request('/edp/experiments/%s' % experiment['_id'],
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatusOk(r)

    experiment = Experiment().load(r.json['_id'], force=True)
    assert updates.items() <= experiment.items()


@pytest.mark.plugin('edp')
def test_update_non_existent(server, user, experiment):
    from girder.plugins.edp.models.experiment import Experiment

    updates = {
        'title': 'Nothing to see here.'
    }

    non_existent = '5ae71e1ff657102b11ce2233'
    r = server.request('/edp/experiments/%s' % non_existent,
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatus(r, 400)


@pytest.mark.plugin('edp')
def test_delete(server, user, experiment):
    from girder.plugins.edp.models.experiment import Experiment

    r = server.request('/edp/experiments/%s' % experiment['_id'],
                       method='DELETE', user=user)
    assertStatusOk(r)

    experiment = Experiment().load(experiment['_id'], force=True)
    assert experiment is None

@pytest.mark.plugin('edp')
def test_delete_with_batch(server, user, experiment, batch):
    from girder.plugins.edp.models.experiment import Experiment
    from girder.plugins.edp.models.batch import Batch

    r = server.request('/edp/experiments/%s' % experiment['_id'],
                       method='DELETE', user=user)
    assertStatusOk(r)

    experiment = Experiment().load(experiment['_id'], force=True)
    assert experiment is None

    batch = Batch().load(batch['_id'], force=True)
    assert batch is None

@pytest.mark.plugin('edp')
def test_find(server, user, experiment):
    from girder.plugins.edp.models.experiment import Experiment

    r = server.request('/edp/experiments',
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_find_owner(server, user, admin, experiment):
    from girder.plugins.edp.models.experiment import Experiment

    params = {
        'owner': admin['_id']
    }

    r = server.request('/edp/experiments', params=params,
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 0

    params['owner'] = user['_id']
    r = server.request('/edp/experiments', params=params,
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_get(server, user, admin, experiment):
    r = server.request('/edp/experiments/%s' % experiment['_id'],
                       method='GET', user=user)
    assertStatusOk(r)
    assert experiment.items() <= r.json.items()

