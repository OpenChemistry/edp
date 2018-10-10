import pytest
import datetime
import json
from pytest_girder.assertions import assertStatus, assertStatusOk


@pytest.mark.plugin('edp')
def test_create_public(server, user, postmortem_request, project):
    from girder.plugins.edp.models.postmortem import Postmortem

    r = server.request('/edp/projects/%s/postmortems' % project['_id'],
                       method='POST', body=json.dumps(postmortem_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    postmortem = Postmortem().load(r.json['_id'], force=True)

    assert postmortem['owner'] == user['_id']
    assert postmortem_request.items() <= postmortem.items()


@pytest.mark.plugin('edp')
def test_create_private(server, user, postmortem_request, project):
    from girder.plugins.edp.models.postmortem import Postmortem

    r = server.request('/edp/projects/%s/postmortems' % project['_id'],
                       method='POST', body=json.dumps(postmortem_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    assert '_id' in r.json

    postmortem = Postmortem().load(r.json['_id'], force=True)
    assert postmortem_request.items() <= postmortem.items()


@pytest.mark.plugin('edp')
def test_update(server, user, project, postmortem):
    from girder.plugins.edp.models.postmortem import Postmortem

    updates = {
        'title': 'Nothing to see here.'
    }

    r = server.request('/edp/projects/%s/postmortems/%s' % (project['_id'], postmortem['_id']),
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatusOk(r)

    postmortem = Postmortem().load(r.json['_id'], force=True)
    assert updates.items() <= postmortem.items()


@pytest.mark.plugin('edp')
def test_update_non_existent(server, user, project, postmortem):
    from girder.plugins.edp.models.postmortem import Postmortem

    updates = {
        'title': 'Nothing to see here.',
    }

    non_existent = '5ae71e1ff657102b11ce2233'
    r = server.request('/edp/projects/%s/postmortems/%s' % (project['_id'], non_existent),
                       method='PATCH', body=json.dumps(updates),
                       type='application/json', user=user)
    assertStatus(r, 400)


@pytest.mark.plugin('edp')
def test_delete(server, user, project, postmortem):
    from girder.plugins.edp.models.postmortem import Postmortem

    r = server.request('/edp/projects/%s/postmortems/%s' % (project['_id'], postmortem['_id']),
                       method='DELETE', user=user)
    assertStatusOk(r)

    postmortem = Postmortem().load(postmortem['_id'], force=True)
    assert postmortem is None

@pytest.mark.plugin('edp')
def test_find(server, user, project, postmortem):
    r = server.request('/edp/projects/%s/postmortems' % project['_id'],
                       method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_find_owner(server, user, admin, project, postmortem):
    from girder.plugins.edp.models.postmortem import Postmortem

    params = {
        'owner': admin['_id']
    }

    r = server.request('/edp/projects/%s/postmortems' % project['_id'],
                       params=params, method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 0

    params['owner'] = user['_id']
    r = server.request('/edp/projects/%s/postmortems' % project['_id'],
                       params=params, method='GET', user=user)
    assertStatusOk(r)
    assert len(r.json) == 1

@pytest.mark.plugin('edp')
def test_get(server, user, admin, project, postmortem):
    r = server.request('/edp/projects/%s/postmortems/%s' % (project['_id'], postmortem['_id']),
                       method='GET', user=user)
    assertStatusOk(r)
    assert postmortem.items() <= r.json.items()

