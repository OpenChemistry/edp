import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException, boundHandler
from girder.constants import AccessType, TokenScope
from girder.models.file import File

from girder.plugins.edp.models.project import Project as ExperimentModel
from girder.plugins.edp.models.batch import Batch as BatchModel
from girder.plugins.edp.models.test import Test as TestModel


@boundHandler
@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Create a test.')
    .modelParam('projectId', 'The project id associated with this test',
           model=ExperimentModel, destName='project',
           level=AccessType.WRITE, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.WRITE, paramType='path')
    .jsonParam('test', 'The test', required=True, paramType='body')
)
def create(self, project, batch, test):
    if batch['projectId'] != project['_id']:
        raise RestException('Invalid project or batch id (%s, %s).' % (project['_id'], batch['_id']))

    self.requireParams(['cellId', 'channel'], test)

    start_date = test.get('startDate')
    cell_id = test.get('cellId')
    channel = test.get('channel')
    comments = test.get('comments')
    schedule_file = test.get('scheduleFile')
    meta_data_file_id = test.get('metaDataFileId', None)
    data_file_id = test.get('dataFileId', None)
    public = test.get('public', False)

    test = TestModel().create(batch, start_date, cell_id,
        channel, comments, schedule_file, meta_data_file_id, data_file_id,
        self.getCurrentUser(), public)

    cherrypy.response.status = 201
    cherrypy.response.headers['Location'] = '/projects/%s/batches/%s/tests/%s' % (project['_id'], batch['_id'],  test['_id'])

    return test

@boundHandler
@access.user(scope=TokenScope.DATA_READ)
@autoDescribeRoute(
    Description('Get an test.')
    .modelParam('projectId', 'The project id',
        model=ExperimentModel, destName='project',
        level=AccessType.READ, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.READ, paramType='path')
    .modelParam('testId', 'The test id',
        model=TestModel, destName='test',
        level=AccessType.READ, paramType='path')
)
def get(self, project, batch, test):
    if test['batchId'] != batch['_id']:
        raise RestException('Invalid batch or test id (%s, %s).' % (project['_id'], test['_id']))

    return test


@boundHandler
@access.user(scope=TokenScope.DATA_READ)
@autoDescribeRoute(
    Description('Find a tests associated with an batch.')
    .modelParam('projectId', 'The project id',
        model=ExperimentModel, destName='project',
        level=AccessType.READ, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.READ, paramType='path')
)
def find(self, project, batch, offset=0, limit=None, sort=None):
    return list(TestModel().find(batch, offset=offset, limit=limit, sort=sort,
        user=self.getCurrentUser()))

@boundHandler
@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Update a test.')
     .modelParam('projectId', 'The project id',
         model=ExperimentModel, destName='project',
         level=AccessType.WRITE, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.WRITE, paramType='path')
    .modelParam('testId', 'The test id',
        model=TestModel, destName='test',
        level=AccessType.WRITE, paramType='path')
    .jsonParam('updates', 'The test updates', required=True, paramType='body')
)
def update(self, project, batch, test, updates):
    if test['batchId'] != batch['_id']:
        raise RestException('Invalid batch or test id (%s, %s).' % (batch['_id'], test['_id']))

    test = TestModel().update(batch, test, updates, self.getCurrentUser())
    return test

@boundHandler
@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Delete a test.')
     .modelParam('projectId', 'The project id associated with this test',
         model=ExperimentModel, destName='project',
         level=AccessType.WRITE, paramType='path')
    .modelParam('batchId', 'The batch id',
        model=BatchModel, destName='batch',
        level=AccessType.WRITE, paramType='path')
    .modelParam('testId', 'The test id',
        model=TestModel, destName='test',
        level=AccessType.WRITE, paramType='path')
)
def delete(self, project, batch, test):
    if test['batchId'] != batch['_id']:
        raise RestException('Invalid batch or test id (%s, %s).' % (batch['_id'], test['_id']))

    TestModel().remove(test, user=self.getCurrentUser())

