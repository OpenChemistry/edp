import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException
from girder.constants import AccessType, TokenScope
from girder.models.file import File

from . import test
from . import batch
from girder.plugins.edp.models.experiment import Experiment as ExperimentModel


class Experiment(Resource):

    def __init__(self):
        super(Experiment, self).__init__()
        self.route('POST', (), self.create)
        self.route('GET', (), self.find)
        self.route('GET', (':experimentId',), self.get)
        self.route('PATCH', (':experimentId',), self.update)
        self.route('DELETE', (':experimentId',), self.delete)

        self.route('POST', (':experimentId', 'batches'), batch.create)
        self.route('GET', (':experimentId', 'batches'), batch.find)
        self.route('GET', (':experimentId', 'batches', ':batchId'), batch.get)
        self.route('PATCH', (':experimentId', 'batches', ':batchId'), batch.update)
        self.route('DELETE', (':experimentId', 'batches', ':batchId'), batch.delete)

        self.route('POST', (':experimentId', 'batches', ':batchId', 'tests'), test.create)
        self.route('GET', (':experimentId', 'batches', ':batchId', 'tests'), test.find)
        self.route('GET', (':experimentId', 'batches', ':batchId', 'tests', ':testId'), test.get)
        self.route('PATCH', (':experimentId', 'batches', ':batchId', 'tests', ':testId'), test.update)
        self.route('DELETE', (':experimentId', 'batches', ':batchId', 'tests', ':testId'), test.delete)

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create an experiment.')
        .jsonParam('experiment', 'The experiment', required=True, paramType='body')
    )
    def create(self, experiment):
        self.requireParams(['startDate', 'title', 'objective'], experiment)

        start_date = experiment.get('startDate')
        title = experiment.get('title')
        objective = experiment.get('objective')
        public = experiment.get('public', False)

        experiment = ExperimentModel().create(start_date, title,
            objective, self.getCurrentUser(), public)

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/experiments/%s' % experiment['_id']

        return experiment

    @access.user(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Find an experiment.')
        .param('owner', 'The owner to return experiments for.', required=False)
    )
    def find(self, owner=None, offset=0, limit=None, sort=None):
        return list(ExperimentModel().find(
            owner=owner, offset=offset, limit=limit, sort=sort,
            user=self.getCurrentUser()))

    @access.user(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get an experiment.')
        .modelParam('experimentId', 'The experiment id',
            model=ExperimentModel, destName='experiment',
            level=AccessType.READ, paramType='path')
    )
    def get(self, experiment):
        return experiment

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Update an experiment.')
        .modelParam('experimentId', 'The experiment id',
            model=ExperimentModel, destName='experiment',
            level=AccessType.WRITE, paramType='path')
        .jsonParam('updates', 'The experiment updates', required=True, paramType='body')
    )
    def update(self, experiment, updates):
        experiment = ExperimentModel().update(experiment, updates,
                                              self.getCurrentUser())
        return experiment

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Update an experiment.')
        .modelParam('experimentId', 'The experiment id',
            model=ExperimentModel, destName='experiment',
            level=AccessType.ADMIN, paramType='path')
    )
    def delete(self, experiment):
        ExperimentModel().remove(experiment, user=self.getCurrentUser())

