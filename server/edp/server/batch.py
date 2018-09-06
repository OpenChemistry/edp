import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException, boundHandler
from girder.constants import AccessType, TokenScope
from girder.models.file import File

from . import test
from girder.plugins.edp.models.batch import Batch as BatchModel
from girder.plugins.edp.models.experiment import Experiment as ExperimentModel


@boundHandler
@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Create a batch.')
    .modelParam('experimentId', 'The experiment id',
        model=ExperimentModel, destName='experiment',
        level=AccessType.READ, paramType='path')
    .jsonParam('batch', 'The batch', required=True, paramType='body')
)
def create(self, experiment, batch):
    self.requireParams(['startDate', 'title', 'motivation', 'experimentalDesign',
                        'experimentalNotes', 'dataNotes'], batch)

    start_date = batch.get('startDate')
    title = batch.get('title')
    motivation = batch.get('motivation')
    experimental_design = batch.get('experimentalDesign')
    experimental_notes = batch.get('experimentalNotes')
    data_notes = batch.get('dataNotes')
    completed = batch.get('completed', False)
    public = batch.get('public', False)

    batch = BatchModel().create(experiment, start_date, title,
        motivation, experimental_design, experimental_notes,
        data_notes, completed, self.getCurrentUser(), public)

    cherrypy.response.status = 201
    cherrypy.response.headers['Location'] = '/experiments/%s/batches/%s' % (experiment['_id'], batch['_id'])

    return batch

@boundHandler
@access.user(scope=TokenScope.DATA_READ)
@autoDescribeRoute(
    Description('Find an experiment.')
    .modelParam('experimentId', 'The experiment id',
        model=ExperimentModel, destName='experiment',
        level=AccessType.READ, paramType='path')
    .param('owner', 'The owner to return experiments for.', required=False)
)
def find(self, experiment, owner=None, offset=0, limit=None, sort=None):
    return list(BatchModel().find(experiment=experiment,
        owner=owner, offset=offset, limit=limit, sort=sort,
        user=self.getCurrentUser()))

@boundHandler
@access.user(scope=TokenScope.DATA_READ)
@autoDescribeRoute(
    Description('Get an experiment.')
    .modelParam('experimentId', 'The experiment id',
        model=ExperimentModel, destName='experiment',
        level=AccessType.READ, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.WRITE, paramType='path')
)
def get(self, experiment, batch):
    if batch['experimentId'] != experiment['_id']:
        raise RestException('Invalid experiment or batch id (%s, %s).' % (experiment['_id'], batch['_id']))

    return batch

@boundHandler
@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Update a batch.')
    .modelParam('experimentId', 'The experiment id',
        model=ExperimentModel, destName='experiment',
        level=AccessType.READ, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.WRITE, paramType='path')
    .jsonParam('updates', 'The experiment updates', required=True, paramType='body')
)
def update(self, experiment, batch, updates):
    if batch['experimentId'] != experiment['_id']:
        raise RestException('Invalid experiment or batch id (%s, %s).' % (experiment['_id'], batch['_id']))

    batch = BatchModel().update(batch, updates, self.getCurrentUser())
    return batch

@boundHandler
@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Delete a batch.')
        .modelParam('experimentId', 'The experiment id',
        model=ExperimentModel, destName='experiment',
        level=AccessType.READ, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.WRITE, paramType='path')
)
def delete(self, experiment, batch):
    if batch['experimentId'] != experiment['_id']:
        raise RestException('Invalid experiment or batch id (%s, %s).' % (experiment['_id'], batch['_id']))

    BatchModel().remove(batch, user=self.getCurrentUser())

