import pytest
import datetime
import json
import six
import os
from pytest_girder.assertions import assertStatus
from girder.models.upload import Upload
from girder.models.file import File
from girder.models.folder import Folder


@pytest.fixture
def project_request():
    yield {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'title',
        'objective': 'I have one.',
        'public': True
    }

@pytest.fixture
def make_project(server):
    from girder.plugins.edp.models.project import Project
    projects = []

    def _make_project(user, request):
        r = server.request('/edp/projects', method='POST', body=json.dumps(request),
                           type='application/json', user=user)
        assertStatus(r, 201)
        projects.append(r.json)

        return  r.json

    yield _make_project

    for project in projects:
        Project().remove(project)


@pytest.fixture
def project(make_project, user, project_request):
    from girder.plugins.edp.models.project import Project

    yield make_project(user, project_request)


@pytest.fixture
def make_girder_file():
    files = []

    def _make_girder_file(assetstore, user, name, contents=b''):
        folder = Folder().find({
            'parentId': user['_id'],
            'name': 'Public'
        })[0]
        file = Upload().uploadFromFile(
            six.BytesIO(contents), size=len(contents), name=name,
            parentType='folder', parent=folder,
            user=user, assetstore=assetstore)
        if not contents:
            file = Upload().finalizeUpload(file, assetstore)

        files.append(file)

        return  file

    yield _make_girder_file

    for file in files:
        File().remove(file)

@pytest.fixture
def batch_request():
    return {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'title',
        'experimentalDesign': 'I designed the cool experiment.',
        'experimentalNotes': 'These are my notes.',
        'dataNotes': 'Here are some notes.',
        'motivation': 'Very motivated!',
        'public': True
    }

@pytest.fixture
def make_batch(server):
    from girder.plugins.edp.models.batch import Batch
    batches = []

    def _make_batch(user, project, cycle, request):
        r = server.request('/edp/projects/%s/cycles/%s/batches' % (
                project['_id'], cycle['_id']), method='POST', body=json.dumps(request),
                type='application/json', user=user)
        assertStatus(r, 201)
        batches.append(r.json)

        return  r.json

    yield _make_batch

    for batch in batches:
        Batch().remove(batch, force=True)

@pytest.fixture
def batch(project, cycle, make_batch, batch_request, user):

    yield make_batch(user, project, cycle, batch_request)

@pytest.fixture
def create_cycletest_request():
    yield {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'cellId': 'cell',
        'batteryType': 'NiCd',
        'channel': '2',
        'comments': 'comments',
        'scheduleFile': 'schedule0123.zip',
        'public': True
    }

@pytest.fixture
def cycletest(server, user, project, cycle, batch, create_cycletest_request):
    from girder.plugins.edp.models.cycletest import CycleTest

    r = server.request('/edp/projects/%s/cycles/%s/batches/%s/tests' % (
            project['_id'], cycle['_id'], batch['_id']),
            method='POST', body=json.dumps(create_cycletest_request),
            type='application/json', user=user)
    assertStatus(r, 201)

    yield r.json

    CycleTest().remove(r.json, user)

@pytest.fixture
def cycle_request():
    return {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'title',
        'public': True
    }

@pytest.fixture
def make_cycle(server):
    from girder.plugins.edp.models.cycle import Cycle
    cycles = []

    def _make_cycle(user, project, request):
        r = server.request('/edp/projects/%s/cycles' % project['_id'], method='POST', body=json.dumps(request),
                           type='application/json', user=user)
        assertStatus(r, 201)
        cycles.append(r.json)

        return  r.json

    yield _make_cycle

    for cycle in cycles:
        Cycle().remove(cycle, force=True)

@pytest.fixture
def cycle(project, make_cycle, cycle_request, user):

    yield make_cycle(user, project, cycle_request)


@pytest.fixture
def postmortem_request():
    return {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'title',
        'public': True
    }

@pytest.fixture
def make_postmortem(server):
    from girder.plugins.edp.models.postmortem import Postmortem
    postmortems = []

    def _make_postmortem(user, project, request):
        r = server.request('/edp/projects/%s/postmortems' % project['_id'], method='POST', body=json.dumps(request),
                           type='application/json', user=user)
        assertStatus(r, 201)
        postmortems.append(r.json)

        return  r.json

    yield _make_postmortem

    for postmortem in postmortems:
        Postmortem().remove(postmortem, force=True)

@pytest.fixture
def postmortem(project, make_postmortem, postmortem_request, user):

    yield make_postmortem(user, project, postmortem_request)

@pytest.fixture
def create_postmortemtest_request():
    yield {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'cellId': 'cell',
        'comments': 'comments',
        'public': True
    }

@pytest.fixture
def postmortemtest(server, user, project, postmortem, create_postmortemtest_request):
    from girder.plugins.edp.models.postmortemtest import PostmortemTest

    r = server.request('/edp/projects/%s/postmortems/%s/tests' % (
            project['_id'], postmortem['_id']),
            method='POST', body=json.dumps(create_postmortemtest_request),
            type='application/json', user=user)
    assertStatus(r, 201)

    yield r.json

    PostmortemTest().remove(r.json, user)
