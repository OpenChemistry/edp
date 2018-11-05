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
        elements = elements.split(',')

    # Find the matching plate maps
    fields = {
        'compositeId': composite['_id']
    }
    if plateId is not None:
        fields['plateId'] = plateId

    if elements is not None:
        fields['elements'] = elements

    platemap_ids = [
        x['_id'] for x in PlateMapModel().find(fields=fields,
                                               projection=['_id'],
                                               user=getCurrentUser())
    ]

    # Find the matching runs
    fields = {
        'compositeId': composite['_id']
    }
    if ph is not None:
        fields['solutionPh'] = ph

    if electrolyte is not None:
        fields['electrolyte'] = electrolyte

    run_ids = [
        x['_id'] for x in RunModel().find(fields=fields,
                                          projection=['_id'],
                                          user=getCurrentUser())
    ]

    # Now use a aggregation pipeline to get the sample sets.
    match = {
        '$match': {
            'runId': {
                '$in': run_ids
            },
            'platemapId': {
                '$in': platemap_ids
            }
        }
    }

    group = {
        '$group': {
            '_id': {
                'runId': '$runId',
                'platemapId': "$platemapId"
            }
        }
    }

    lookup_platemap = {
        '$lookup': {
            'from': 'edp.platemaps',
            'localField': '_id.platemapId',
            'foreignField': '_id',
            'as': 'platemap'
        }
    }

    lookup_run = {
        '$lookup': {
            'from': 'edp.runs',
            'localField': '_id.runId',
            'foreignField': '_id',
            'as': 'run'
        }
    }

    unwind_platemap = {
        '$unwind': '$platemap'
    }

    unwind_run = {
        '$unwind': '$run'
    }


    project = {
        '$project': {
            '_id': 0,
            'platemap' : 1 ,
            'run' : 1
        }
    }


    pipeline = [match, group, lookup_platemap, lookup_run, unwind_platemap,
                unwind_run, project]
    sample_sets = SampleModel().collection.aggregate(pipeline)

    return list(sample_sets)
