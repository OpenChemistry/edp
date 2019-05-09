from girder.constants import AccessType

from .base import Base
from bson.objectid import ObjectId
from girder.plugins.edp.models.analysis import Analysis as AnalysisModel
from . import edp_group

class FOM(Base):

    def __init__(self):
        from girder.plugins.edp.models.sample import Sample
        super(FOM, self).__init__(
            name='edp.fom',
            props=(
                {
                    'name': 'sampleId',
                    'create': True,
                    'ensure_index': True
                },
                {
                    'name': 'name',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True
                },
                {
                    'name': 'value',
                    'expose': True,
                    'create': True,
                    'mutable': False
                },
                {
                    'name': 'runId',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'type': ObjectId
                },
                {
                    'name': 'analysisId',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'type': ObjectId
                }
            ),
            parent_model=Sample,
            url='fom'
        )

    def create(self, **kwargs):
        sample_id = kwargs.get('sampleId')
        if sample_id is not None:
            sample_id = ObjectId(sample_id)
        name = kwargs.get('name')
        value = kwargs.get('value')
        run_id = kwargs.get('runId')
        if run_id is not None:
            run_id = ObjectId(run_id)
        analysis_id = kwargs.get('analysisId')
        if analysis_id is not None:
            analysis_id = ObjectId(analysis_id)

        # See is we already have a FOM
        query = {
            'sampleId': sample_id,
            'name': name,
            'runId': run_id,
        }
        fom = self.findOne(query)

        # If we have one then lookup the analysis and replace if the timestamp
        # and index is larger.
        if fom is not None:
            query = {
                '_id': {
                    '$in': [fom['analysisId'], analysis_id]
                }
            }
            analyses = list(AnalysisModel().find(query, sort=[('index', -1), ('timestamp', -1)]))
            if len(analyses) > 0:
                analysis_id = analyses[0]['_id']

            update = {
                '$set': {
                    'analysisId': analysis_id,
                    'value': value
                }
            }
            self.collection.update_one(query, update)

            fom['analysisId'] = analysis_id
            fom['value'] = value
        # New FOM
        else:
            fom = {
                'name': name,
                'sampleId': sample_id,
                'runId': run_id,
                'analysisId': analysis_id,
                'value': value,
            }

            fom = self.save(fom)


        return fom
