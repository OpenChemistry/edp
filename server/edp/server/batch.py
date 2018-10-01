import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException, boundHandler
from girder.constants import AccessType, TokenScope
from girder.models.file import File

from . import test
from girder.plugins.edp.models.batch import Batch as BatchModel
from girder.plugins.edp.models.project import Project as ProjectModel


@boundHandler
@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Create a batch.')
    .modelParam('projectId', 'The project id',
        model=ProjectModel, destName='project',
        level=AccessType.READ, paramType='path')
    .jsonParam('batch', 'The batch', required=True, paramType='body')
)
def create(self, project, batch):
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

    batch = BatchModel().create(project, start_date, title,
        motivation, experimental_design, experimental_notes,
        data_notes, completed, self.getCurrentUser(), public)

    cherrypy.response.status = 201
    cherrypy.response.headers['Location'] = '/projects/%s/batches/%s' % (project['_id'], batch['_id'])

    return batch

@boundHandler
@access.user(scope=TokenScope.DATA_READ)
@autoDescribeRoute(
    Description('Find an project.')
    .modelParam('projectId', 'The project id',
        model=ProjectModel, destName='project',
        level=AccessType.READ, paramType='path')
    .param('owner', 'The owner to return projects for.', required=False)
)
def find(self, project, owner=None, offset=0, limit=None, sort=None):
    return list(BatchModel().find(project=project,
        owner=owner, offset=offset, limit=limit, sort=sort,
        user=self.getCurrentUser()))

@boundHandler
@access.user(scope=TokenScope.DATA_READ)
@autoDescribeRoute(
    Description('Get an project.')
    .modelParam('projectId', 'The project id',
        model=ProjectModel, destName='project',
        level=AccessType.READ, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.WRITE, paramType='path')
)
def get(self, project, batch):
    if batch['projectId'] != project['_id']:
        raise RestException('Invalid project or batch id (%s, %s).' % (project['_id'], batch['_id']))

    return batch

@boundHandler
@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Update a batch.')
    .modelParam('projectId', 'The project id',
        model=ProjectModel, destName='project',
        level=AccessType.READ, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.WRITE, paramType='path')
    .jsonParam('updates', 'The project updates', required=True, paramType='body')
)
def update(self, project, batch, updates):
    if batch['projectId'] != project['_id']:
        raise RestException('Invalid project or batch id (%s, %s).' % (project['_id'], batch['_id']))

    batch = BatchModel().update(batch, updates, self.getCurrentUser())
    return batch

@boundHandler
@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Delete a batch.')
        .modelParam('projectId', 'The project id',
        model=ProjectModel, destName='project',
        level=AccessType.READ, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.WRITE, paramType='path')
)
def delete(self, project, batch):
    if batch['projectId'] != project['_id']:
        raise RestException('Invalid project or batch id (%s, %s).' % (project['_id'], batch['_id']))

    BatchModel().remove(batch, user=self.getCurrentUser())

