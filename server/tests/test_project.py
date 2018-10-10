import pytest
import datetime
import json
from pytest_girder.assertions import assertStatus, assertStatusOk


@pytest.mark.plugin('edp')
def test_create_public(server, user, project_request):
    from girder.plugins.edp.models.project import Project

    r = server.request('/edp/projects', method='POST', body=json.dumps(project_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    project = Project().load(r.json['_id'], force=True)
    assert project['owner'] == user['_id']
    assert project_request.items() <= project.items()


@pytest.mark.plugin('edp')
def test_create_private(server, user, project_request):
    from girder.plugins.edp.models.project import Project

    project_request['public'] = False
    r = server.request('/edp/projects', method='POST', body=json.dumps(project_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    project = Project().load(r.json['_id'], force=True)
    assert project_request.items() <= project.items()


@pytest.mark.plugin('edp')
def test_update(server, user, project):
    from girder.plugins.edp.models.project import Project

    updates = {
        'title': 'Nothing to see here.'
    }

    r = server.request('/edp/projects/%s' % project['_id'],
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatusOk(r)

    project = Project().load(r.json['_id'], force=True)
    assert updates.items() <= project.items()


@pytest.mark.plugin('edp')
def test_update_non_existent(server, user, project):
    from girder.plugins.edp.models.project import Project

    updates = {
        'title': 'Nothing to see here.'
    }

    non_existent = '5ae71e1ff657102b11ce2233'
    r = server.request('/edp/projects/%s' % non_existent,
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatus(r, 400)


@pytest.mark.plugin('edp')
def test_delete(server, user, project):
    from girder.plugins.edp.models.project import Project

    r = server.request('/edp/projects/%s' % project['_id'],
                       method='DELETE', user=user)
    assertStatusOk(r)

    project = Project().load(project['_id'], force=True)
    assert project is None

@pytest.mark.plugin('edp')
def test_delete_with_cycle(server, user, project, cycle):
    from girder.plugins.edp.models.project import Project
    from girder.plugins.edp.models.cycle import Cycle

    r = server.request('/edp/projects/%s' % project['_id'],
                       method='DELETE', user=user)
    assertStatusOk(r)

    project = Project().load(project['_id'], force=True)
    assert project is None

    cycle = Cycle().load(cycle['_id'], force=True)
    assert cycle is None

@pytest.mark.plugin('edp')
def test_find(server, user, project):
    from girder.plugins.edp.models.project import Project

    r = server.request('/edp/projects',
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_find_owner(server, user, admin, project):
    from girder.plugins.edp.models.project import Project

    params = {
        'owner': admin['_id']
    }

    r = server.request('/edp/projects', params=params,
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 0

    params['owner'] = user['_id']
    r = server.request('/edp/projects', params=params,
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_get(server, user, admin, project):
    r = server.request('/edp/projects/%s' % project['_id'],
                       method='GET', user=user)
    assertStatusOk(r)
    assert project.items() <= r.json.items()

