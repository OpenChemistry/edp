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


@access.public(scope=TokenScope.DATA_READ)
@autoDescribeRoute(
    Description('Search models by fields.')
    .modelParam('projectId', 'The project id',
                    model=ProjectModel, destName='project',
                    level=AccessType.READ, paramType='path')
    .modelParam('compositeId', 'The composite id',
                    model=CompositeModel, destName='composite',
                    level=AccessType.READ, paramType='path')
    .param('elements', 'The elements in the plate map', required=False)
    .param('ph', 'The pH', required=False)
    .param('electrolyte', 'The electrolyte used', required=False)
    .param('plateId', 'The plate id', required=False)
)
def search(project, composite, elements=None, ph=None, electrolyte=None, plateId=None):
    if elements is not None:
        elements = [e.strip().lower() for e in elements.split(',') if e.strip()]

    # Find the matching runs
    match_runs = {
        'compositeId': composite['_id']
    }
    if ph is not None:
        match_runs['solutionPh'] = float(ph)

    if electrolyte is not None:
        match_runs['electrolyte'] = electrolyte

    if plateId is not None:
        match_runs['plateId'] = int(plateId)

    match_runs = {
        '$match': match_runs
    }

    lookup_platemaps_match = {
        '$expr': {
            '$and': [{
                '$eq': ["$plateId",  "$$plateId"]
            }]
        }
    }

    if elements:
        lookup_platemaps_match['$expr']['$and'].append({
            '$setIsSubset': [elements, '$elements']
        })

    lookup_platemaps =   {
        '$lookup':{
           'from': 'edp.platemaps',
           'let': {
               'plateId': '$plateId'
            },
           'pipeline': [{
               '$match': lookup_platemaps_match
           }],
           'as': 'platemap'
         }
    }

    unwind_platemap = {
        '$unwind': '$platemap'
    }


    project = {
        '$project': {
            '_id': 0,
            'run': {
                '_id': '$_id',
                'runId': '$runId',
                'solutionPh': '$solutionPh',
                'electrolyte': '$electrolyte',
                'plateId': '$plateId',
            },
            'platemap._id': 1,
            'platemap.elements': 1,
            'platemap.plateId': 1
        }
    }

    pipeline = [match_runs, lookup_platemaps, unwind_platemap, project]
    sample_sets = RunModel().collection.aggregate(pipeline)

    return list(sample_sets)
