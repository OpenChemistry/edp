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
