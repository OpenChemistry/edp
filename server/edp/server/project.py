import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException
from girder.constants import AccessType, TokenScope
from girder.models.file import File
from girder.models.setting import Setting

from . import resource
from . import comp_search
from girder.plugins.edp.models.project import Project as ProjectModel
from girder.plugins.edp.models.batch import Batch as BatchModel
from girder.plugins.edp.models.cycletest import CycleTest as CycleTestModel
from girder.plugins.edp.models.cycle import Cycle as CycleModel
from girder.plugins.edp.models.postmortem import Postmortem as PostmortemModel
from girder.plugins.edp.models.postmortemtest import PostmortemTest as PostmortemTestModel
from girder.plugins.edp.models.composite import Composite as CompositeModel
from girder.plugins.edp.models.run import Run as RunModel
from girder.plugins.edp.models.sample import Sample as SampleModel
from girder.plugins.edp.models.timeseries import TimeSeries as TimeSeriesModel
from girder.plugins.edp.models.fom import FOM as FOMModel
from girder.plugins.edp.models.platemap import PlateMap as PlateMapModel
from .sample import Sample
from .timeseries import TimeSeries
from . import configuration
from . import constants


class Route(object):

    def __init__(self, resource, route):
        self.resource = resource
        self.route = route

    def add_child_route(self, name, id_name, resource):
        if not isinstance(name, tuple):
            name = (name,)
        self.resource.route('POST', self.route + name, resource.create)
        self.resource.route('GET',  self.route + name, resource.find)
        id_route = self.route + name + (':%s' % id_name,)
        self.resource.route('GET', id_route, resource.get)
        self.resource.route('PATCH', id_route, resource.update)
        self.resource.route('DELETE', id_route, resource.delete)

        return Route(self.resource, id_route)

class Project(Resource):

    def __init__(self):
        super(Project, self).__init__()
        deployment = Setting().get(constants.CONFIGURATION_DEPLOYMENT)
        project_route = self.add_route('projectId', self)

        if deployment == constants.SOW10_DEPLOYMENT:
            batch_route = project_route.add_child_route(BatchModel().url, 'batchId', resource.create(BatchModel)())
            batch_route.add_child_route(CycleTestModel().url, 'cycletestId', resource.create(CycleTestModel)())
        else:
            postmortem_route = project_route.add_child_route(PostmortemModel().url, 'postmortemId', resource.create(PostmortemModel)())
            cycle_route = project_route.add_child_route(CycleModel().url, 'cycleId', resource.create(CycleModel)())
            batch_route = cycle_route.add_child_route(BatchModel().url, 'batchId', resource.create(BatchModel)())
            batch_route.add_child_route(CycleTestModel().url, 'cycletestId', resource.create(CycleTestModel)())
            postmortem_route.add_child_route(PostmortemTestModel().url, 'postmortemtestId', resource.create(PostmortemTestModel)())

            # Composite routes
            composite_route = project_route.add_child_route(CompositeModel().url, 'compositeId', resource.create(CompositeModel)())
            composite_route.add_child_route(RunModel().url, 'runId', resource.create(RunModel)())
            platemap_route = composite_route.add_child_route((PlateMapModel().url), 'platemapId', resource.create(PlateMapModel)())
            sample_route = composite_route.add_child_route(SampleModel().url, 'sampleId', Sample())
            sample_route.add_child_route(TimeSeriesModel().url, 'timeseriesId', TimeSeries())
            sample_route.add_child_route(FOMModel().url, 'fomId', resource.create(FOMModel)())

            self.route('GET', (':projectId', 'composites', ':compositeId', 'search', ), comp_search.search)

    def add_route(self, id_name, resource):
        self.route('POST', (), resource.create)
        self.route('GET', (), resource.find)
        id_route = (':%s' % id_name,)
        self.route('GET', id_route, resource.get)
        self.route('PATCH', id_route, resource.update)
        self.route('DELETE', id_route, resource.delete)

        return Route(self, id_route)

    @access.user(scope=TokenScope.DATA_WRITE)
    @autoDescribeRoute(
        Description('Create an project.')
        .jsonParam('project', 'The project', required=True, paramType='body')
    )
    def create(self, project):
        require = ['title', 'objective']

        if Setting().get(constants.CONFIGURATION_DEPLOYMENT != constants.SOW11_DEPLOYMENT):
            require.append('startDate')

        self.requireParams(require, project)
        start_date = project.get('startDate')
        title = project.get('title')
        objective = project.get('objective')
        motivation = project.get('motivation', None)
        public = project.get('public', False)
        data_file_id = project.get('dataFileId')

        project = ProjectModel().create(start_date, title,
            objective, motivation, self.getCurrentUser(), data_file_id, public)

        cherrypy.response.status = 201
        cherrypy.response.headers['Location'] = '/projects/%s' % project['_id']

        return project

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Find an project.')
        .param('owner', 'The owner to return projects for.', required=False)
    )
    def find(self, owner=None, offset=0, limit=None, sort=None):
        return list(ProjectModel().find(
            owner=owner, offset=offset, limit=limit, sort=sort,
            user=self.getCurrentUser()))

    @access.public(scope=TokenScope.DATA_READ)
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

