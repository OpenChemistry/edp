import itertools

from bson.objectid import ObjectId
from girder.api import access
from girder.api.describe import Description, autoDescribeRoute, getCurrentUser
from girder.constants import AccessType, TokenScope

from girder.plugins.edp.models.project import Project as ProjectModel
from girder.plugins.edp.models.composite import Composite as CompositeModel
from girder.plugins.edp.models.run import Run as RunModel
from girder.plugins.edp.models.platemap import PlateMap as PlateMapModel
from girder.plugins.edp.models.sample import Sample as SampleModel

from girder_worker.docker.tasks import docker_run

@access.user(scope=TokenScope.DATA_WRITE)
@autoDescribeRoute(
    Description('Demo execute endpoint.')
    .modelParam('projectId', 'The project id',
                    model=ProjectModel, destName='project',
                    level=AccessType.READ, paramType='path')
    .modelParam('compositeId', 'The composite id',
                    model=CompositeModel, destName='composite',
                    level=AccessType.READ, paramType='path')
)
def execute(project, composite):
    print('execute')
    result = docker_run.delay(
        'hello-world', pull_image=True, remove_container=True)

    return result.job
