from girder.api import access
from girder.api.describe import Description, autoDescribeRoute, getCurrentUser
from girder.constants import AccessType, TokenScope

from girder.plugins.edp.models.run import Run as RunModel
from girder.plugins.edp.models.platemap import PlateMap as PlateMapModel
from girder.plugins.edp.models.sample import Sample as SampleModel


@access.public(scope=TokenScope.DATA_READ)
@autoDescribeRoute(
    Description('Search models by fields.')
    .param('elements', 'The elements in the plate map', required=False)
    .param('ph', 'The pH', required=False)
    .param('electrolyte', 'The electrolyte used', required=False)
    .param('plateId', 'The plate id', required=False)
)
def search(elements=None, ph=None, electrolyte=None, plateId=None):
    if elements is not None:
        elements = elements.split(',')

    # Find the matching plate maps
    fields = { }
    if plateId is not None:
        fields['plateId'] = plateId

    if elements is not None:
        fields['elements'] = elements

    platemap_ids = [
        x['_id'] for x in PlateMapModel().find(fields=fields,
                                               projection=['_id'],
                                               user=getCurrentUser())
    ]

    # Fin the matching runs
    fields = {}
    if ph is not None:
        fields['solutionPh'] = ph

    if electrolyte is not None:
        fields['electrolyte'] = electrolyte

    run_ids = [
        x['_id'] for x in RunModel().find(fields=fields,
                                          projection=['_id'],
                                          user=getCurrentUser())
    ]

    print(run_ids)


    # Now use a aggregation pipeline to get the sample sets.
    match = {
        '$match': {
            'runId': {
                '$in': run_ids
            },
            'plateMapId': {
                '$in': platemap_ids
            }
        }
    }

    group = {
        '$group': {
            '_id': {
                'runId': '$runId',
                'plateMapId': "$plateMapId"
            }
        }
    }

    pipeline = [match, group]
    sample_sets = SampleModel().collection.aggregate([match, group])

    return list(sample_sets)
