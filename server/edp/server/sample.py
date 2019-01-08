from bson.objectid import ObjectId

from . import resource

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException, boundHandler, getCurrentUser
from girder.constants import AccessType, TokenScope
from girder.models.file import File
from girder.plugins.edp.models.sample import Sample as SampleModel
from girder.plugins.edp.models.project import Project as ProjectModel
from girder.plugins.edp.models.composite import Composite as CompositeModel
from girder.plugins.edp.models.platemap import PlateMap as PlateMapModel



class Sample(resource.create(SampleModel)):

    @access.user(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get an project.')
        .modelParam('projectId', 'The project id',
            model=ProjectModel, destName='project',
            level=AccessType.READ, paramType='path')
        .modelParam('compositeId', 'The composite id',
            model=CompositeModel, destName='composite',
            level=AccessType.READ, paramType='path')
        .param('runId', '', required=False)
        .param('platemapId', '', required=False)
        .pagingParams(defaultSort='sampleNum')
    )
    def find(self, project, composite, runId, platemapId, offset=0, limit=None, sort=None):
        sample_ids = None

        if platemapId is not None:
            platemap = PlateMapModel().load(ObjectId(platemapId), level=AccessType.READ, user=getCurrentUser())
            sample_ids = platemap['sampleIds']

        query = {}

        if sample_ids is not None:
            query['_id']= {
                '$in': sample_ids
            }

        cursor = SampleModel().find(query=query, offset=offset,
                                      sort=sort, user=getCurrentUser())


        return  list(SampleModel().filterResultsByPermission(cursor=cursor, user=getCurrentUser(),
                                                             level=AccessType.READ,
                                                             limit=limit, offset=offset))

