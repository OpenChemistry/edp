import pytest
import datetime
import json
from pytest_girder.assertions import assertStatus, assertStatusOk


@pytest.mark.plugin('edp')
def test_create_public(server, user, cycle_request, project):
    from girder.plugins.edp.models.cycle import Cycle

    r = server.request('/edp/projects/%s/cycles' % project['_id'],
                       method='POST', body=json.dumps(cycle_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    cycle = Cycle().load(r.json['_id'], force=True)

    assert cycle['owner'] == user['_id']
    assert cycle_request.items() <= cycle.items()


@pytest.mark.plugin('edp')
def test_create_private(server, user, cycle_request, project):
    from girder.plugins.edp.models.cycle import Cycle

    r = server.request('/edp/projects/%s/cycles' % project['_id'],
                       method='POST', body=json.dumps(cycle_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    cycle = Cycle().load(r.json['_id'], force=True)
    assert cycle_request.items() <= cycle.items()


@pytest.mark.plugin('edp')
def test_update(server, user, project, cycle):
    from girder.plugins.edp.models.cycle import Cycle

    updates = {
        'title': 'Nothing to see here.'
    }

    r = server.request('/edp/projects/%s/cycles/%s' % (project['_id'], cycle['_id']),
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatusOk(r)

    cycle = Cycle().load(r.json['_id'], force=True)
    assert updates.items() <= cycle.items()


@pytest.mark.plugin('edp')
def test_update_non_existent(server, user, project, cycle):
    from girder.plugins.edp.models.cycle import Cycle

    updates = {
        'title': 'Nothing to see here.',
    }

    non_existent = '5ae71e1ff657102b11ce2233'
    r = server.request('/edp/projects/%s/cycles/%s' % (project['_id'], non_existent),
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatus(r, 400)


@pytest.mark.plugin('edp')
def test_delete(server, user, project, cycle):
    from girder.plugins.edp.models.cycle import Cycle

    r = server.request('/edp/projects/%s/cycles/%s' % (project['_id'], cycle['_id']),
                       method='DELETE', user=user)
    assertStatusOk(r)

    cycle = Cycle().load(cycle['_id'], force=True)
    assert cycle is None

# @pytest.mark.plugin('edp')
# def test_delete_with_test(server, user, project, cycle, test):
#     from girder.plugins.edp.models.cycle import Cycle
#     from girder.plugins.edp.models.test import Test
#
#     r = server.request('/edp/projects/%s/cycles/%s' % (project['_id'], cycle['_id']),
#                        method='DELETE', user=user)
#     assertStatusOk(r)
#
#     cycle = Cycle().load(cycle['_id'], force=True)
#     assert cycle is None
#
#     test = Test().load(test['_id'], force=True)
#     assert test is None

@pytest.mark.plugin('edp')
def test_find(server, user, project, cycle):
    r = server.request('/edp/projects/%s/cycles' % project['_id'],
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_find_owner(server, user, admin, project, cycle):
    from girder.plugins.edp.models.cycle import Cycle

    params = {
        'owner': admin['_id']
    }

    r = server.request('/edp/projects/%s/cycles' % project['_id'],
                       params=params, method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 0

    params['owner'] = user['_id']
    r = server.request('/edp/projects/%s/cycles' % project['_id'],
                       params=params, method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_get(server, user, admin, project, cycle):
    r = server.request('/edp/projects/%s/cycles/%s' % (project['_id'], cycle['_id']),
                       method='GET', user=user)
    assertStatusOk(r)
    assert cycle.items() <= r.json.items()

