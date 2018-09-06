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
def experiment_request():
    yield {
        'startDate': datetime.datetime.utcnow().timestamp(),
        'title': 'title',
        'objective': 'I have one.',
        'public': True
    }

@pytest.fixture
def make_experiment(server):
    from girder.plugins.edp.models.experiment import Experiment
    experiments = []

    def _make_experiment(user, request):
        r = server.request('/edp/experiments', method='POST', body=json.dumps(request),
                           type='application/json', user=user)
        assertStatus(r, 201)
        experiments.append(r.json)

        return  r.json

    yield _make_experiment

    for experiment in experiments:
        Experiment().remove(experiment)


@pytest.fixture
def experiment(make_experiment, user, experiment_request):
    from girder.plugins.edp.models.experiment import Experiment

    yield make_experiment(user, experiment_request)


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

    def _make_batch(user, experiment, request):
        r = server.request('/edp/experiments/%s/batches' % experiment['_id'], method='POST', body=json.dumps(request),
                           type='application/json', user=user)
        assertStatus(r, 201)
        batches.append(r.json)

        return  r.json

    yield _make_batch

    for batch in batches:
        Batch().remove(batch)

@pytest.fixture
def batch(experiment, make_batch, batch_request, user):

    yield make_batch(user, experiment, batch_request)
