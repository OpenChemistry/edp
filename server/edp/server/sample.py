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
        .jsonParam('elements', '', required=False)
        .pagingParams(defaultSort='sampleNum')
    )
    def find(self, project, composite, runId, platemapId, elements, offset=0, limit=None, sort=None):
        platemap = PlateMapModel().load(ObjectId(platemapId), level=AccessType.READ, user=getCurrentUser())

        and_exp = [{
                '$eq': ['$plateId', platemap['plateId']]
        }]
        match_samples = {
            '$match': {
                '$expr': {
                    '$and': and_exp
                },
            }
        }

        if elements is not None:
            and_exp.append({
                '$setIsSubset': [
                    '$composition.elements', elements
                ]
            })

        lookup_fom_match = {
            '$expr': {
                '$and': [{
                    '$eq': ["$sampleId",  "$$id"]
                    }]
            }
        }

        if runId is not None:
            lookup_fom_match['$expr']['$and'].append({
                '$eq': ['$runId', ObjectId(runId)]
            })

        lookup_fom =   {
            '$lookup':{
               'from': 'edp.fom',
               'let': {
                   'id': '$_id'
                },
               'pipeline': [{
                   '$match': lookup_fom_match
                },
                {
                    '$project': {
                        'sampleId': 0
                    }
                }
               ],
               'as': 'fom'
             }
        }

        exclude_empty =  {
            "$match": {
                "fom": {"$ne": [] }
            }
        }

        pipeline = [match_samples, lookup_fom, exclude_empty]
        cursor = SampleModel().collection.aggregate(pipeline)

        return  list(SampleModel().filterResultsByPermission(cursor=cursor, user=getCurrentUser(),
                                                             level=AccessType.READ,
                                                             limit=limit, offset=offset))
