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
        elements = elements.split(',')

    # Find the matching runs
    fields = {
        'compositeId': composite['_id']
    }
    if ph is not None:
        fields['solutionPh'] = ph

    if electrolyte is not None:
        fields['electrolyte'] = electrolyte

    run_ids = [
        x['_id'] for x in RunModel().query(fields=fields,
                                           projection=['_id', 'access'],
                                           user=getCurrentUser())
    ]

    match = {
        '$match': {}
    }

    if elements:
        match['$match'] = {
           'elements': {
                '$all': elements
            }
        }

    unwind_samples = {
        '$unwind': '$sampleIds'
    }

    lookup_sample = {
        '$lookup': {
            'from': 'edp.samples',
            'localField': 'sampleIds',
            'foreignField': '_id',
            'as': 'sample'
        }
    }

    match_run = {
        '$match': {
            'sample.runId': {
                '$in': run_ids
            }
        }
    }

    group = {
        '$group': {
            '_id': {
                'runId': '$sample.runId',
                'platemapId': "$_id"
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

    unwind_id_run = {
        '$unwind': '$_id.runId'
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
            'run._id': 1,
            'run.runId': 1,
            'run.solutionPh': 1,
            'run.electrolyte': 1,
            'run.plateId': 1,
            'platemap._id': 1,
            'platemap.elements': 1,
            'platemap.plateId': 1
        }
    }

    pipeline = [match, unwind_samples, lookup_sample, match_run, group,
                unwind_id_run, lookup_platemap, lookup_run, unwind_platemap,
                unwind_run, project]
    sample_sets = PlateMapModel().collection.aggregate(pipeline)

    return list(sample_sets)
