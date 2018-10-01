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

    def _make_batch(user, project, request):
        r = server.request('/edp/projects/%s/batches' % project['_id'], method='POST', body=json.dumps(request),
                           type='application/json', user=user)
        assertStatus(r, 201)
        batches.append(r.json)

        return  r.json

    yield _make_batch

    for batch in batches:
        Batch().remove(batch, force=True)

@pytest.fixture
def batch(project, make_batch, batch_request, user):

    yield make_batch(user, project, batch_request)

@pytest.fixture
def create_test_request():
    yield {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'cellId': 'cell',
        'channel': '2',
        'comments': 'comments',
        'scheduleFile': 'schedule0123.zip',
        'public': True
    }

@pytest.fixture
def test(server, user, project, batch, create_test_request):
    from girder.plugins.edp.models.test import Test

    r = server.request('/edp/projects/%s/batches/%s/tests' % (project['_id'], batch['_id']),
                       method='POST', body=json.dumps(create_test_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    yield r.json

    Test().remove(r.json, user)
