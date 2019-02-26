from bson.objectid import ObjectId

from . import resource

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException, boundHandler, getCurrentUser
from girder.constants import AccessType, TokenScope
from girder.plugins.edp.models.sample import Sample as SampleModel
from girder.plugins.edp.models.project import Project as ProjectModel
from girder.plugins.edp.models.composite import Composite as CompositeModel
from girder.plugins.edp.models.timeseries import TimeSeries as TimeSeriesModel



class TimeSeries(resource.create(TimeSeriesModel)):

    @access.user(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get an timeseries.')
        .modelParam('projectId', 'The project id',
            model=ProjectModel, destName='project',
            level=AccessType.READ, paramType='path')
        .modelParam('compositeId', 'The composite id',
            model=CompositeModel, destName='composite',
            level=AccessType.READ, paramType='path')
        .modelParam('sampleId', 'The sample id',
            model=SampleModel, destName='sample',
            level=AccessType.READ, paramType='path')
        .param('runId', '', required=True)
        .pagingParams(defaultSort='sampleNum')
    )
    def find(self, project, composite, sample, runId, offset=0, limit=None, sort=None):
        query = {
            'sampleId': sample['_id'],
            'runId': {
                '$in': [None, ObjectId(runId)]
            }
        }

        cursor = TimeSeriesModel().find(query=query, offset=offset,
                                        sort=sort, user=getCurrentUser())

        return  list(TimeSeriesModel().filterResultsByPermission(cursor=cursor, user=getCurrentUser(),
                                                                 level=AccessType.READ,
                                                                 limit=limit, offset=offset))

