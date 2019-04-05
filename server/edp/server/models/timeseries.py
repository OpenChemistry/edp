from .base import Base
from bson.objectid import ObjectId


class TimeSeries(Base):

    def __init__(self):
        from girder.plugins.edp.models.sample import Sample
        super(TimeSeries, self).__init__(
            name='edp.timeseries',
            props=(
                {
                    'name': 'sampleId',
                    'create': True,
                    'ensure_index': True
                },
                {
                    'name': 'data',
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
                    'name': 'technique',
                    'expose': True,
                    'create': True,
                    'mutable': False
                }
            ),
            parent_model=Sample,
            url='timeseries'
        )
