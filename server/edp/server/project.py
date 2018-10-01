import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException
from girder.constants import AccessType, TokenScope
from girder.models.file import File

from . import test
from . import batch
from girder.plugins.edp.models.project import Project as ProjectModel


class Project(Resource):

    def __init__(self):
        super(Project, self).__init__()
        self.route('POST', (), self.create)
        self.route('GET', (), self.find)
        self.route('GET', (':projectId',), self.get)
        self.route('PATCH', (':projectId',), self.update)
        self.route('DELETE', (':projectId',), self.delete)

        self.route('POST', (':projectId', 'batches'), batch.create)
        self.route('GET', (':projectId', 'batches'), batch.find)
        self.route('GET', (':projectId', 'batches', ':batchId'), batch.get)
        self.route('PATCH', (':projectId', 'batches', ':batchId'), batch.update)
        self.route('DELETE', (':projectId', 'batches', ':batchId'), batch.delete)

        self.route('POST', (':projectId', 'batches', ':batchId', 'tests'), test.create)
        self.route('GET', (':projectId', 'batches', ':batchId', 'tests'), test.find)
        self.route('GET', (':projectId', 'batches', ':batchId', 'tests', ':testId'), test.get)
        self.route('PATCH', (':projectId', 'batches', ':batchId', 'tests', ':testId'), test.update)
        self.route('DELETE', (':projectId', 'batches', ':batchId', 'tests', ':testId'), test.delete)

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create an project.')
        .jsonParam('project', 'The project', required=True, paramType='body')
    )
    def create(self, project):
        self.requireParams(['startDate', 'title', 'objective'], project)

        start_date = project.get('startDate')
        title = project.get('title')
        objective = project.get('objective')
        public = project.get('public', False)

        project = ProjectModel().create(start_date, title,
            objective, self.getCurrentUser(), public)

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/projects/%s' % project['_id']

        return project

    @access.user(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Find an project.')
        .param('owner', 'The owner to return projects for.', required=False)
    )
    def find(self, owner=None, offset=0, limit=None, sort=None):
        return list(ProjectModel().find(
            owner=owner, offset=offset, limit=limit, sort=sort,
            user=self.getCurrentUser()))

    @access.user(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get an project.')
        .modelParam('projectId', 'The project id',
            model=ProjectModel, destName='project',
            level=AccessType.READ, paramType='path')
    )
    def get(self, project):
        return project

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Update an project.')
        .modelParam('projectId', 'The project id',
            model=ProjectModel, destName='project',
            level=AccessType.WRITE, paramType='path')
        .jsonParam('updates', 'The project updates', required=True, paramType='body')
    )
    def update(self, project, updates):
        project = ProjectModel().update(project, updates,
                                              self.getCurrentUser())
        return project

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Update an project.')
        .modelParam('projectId', 'The project id',
            model=ProjectModel, destName='project',
            level=AccessType.ADMIN, paramType='path')
    )
    def delete(self, project):
        ProjectModel().remove(project, user=self.getCurrentUser())

