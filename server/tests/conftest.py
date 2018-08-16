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
def create_request():
    yield {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'title',
        'experimentalDesign': 'I designed the cool experiment.',
        'experimentalNotes': 'These are my notes.',
        'dataNotes': 'Here are some notes.',
        'public': True
    }

@pytest.fixture
def experiment(server, user, create_request):
    from girder.plugins.edp.models.experiment import Experiment

    r = server.request('/edp/experiments', method='POST', body=json.dumps(create_request),
                       type='application/json', user=user)
    assertStatus(r, 201)

    yield r.json

    Experiment().remove(r.json, force=True)


@pytest.fixture
def make_girder_file():
    files = []

    def _make_girder_file(assetstore, user, name, contents=b''):
        folder = Folder().find({
            'parentId': user['_id'],
            'name': 'Public'
        })[0]
        upload = Upload().uploadFromFile(
            six.BytesIO(contents), size=len(contents), name=name,
            parentType='folder', parent=folder,
            user=user, assetstore=assetstore)
        file = Upload().finalizeUpload(upload, assetstore)
        files.append(file)

        return  file

    yield _make_girder_file

    #for file in files:
     #   File().remove(file)
