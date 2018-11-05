from .base import Base


class TimeSeries(Base):

    def __init__(self):
        from girder.plugins.edp.models.sample import Sample
        super(TimeSeries, self).__init__(
            name='edp.timeseries',
            props=(
                {
                    'name': 'sampleId',
                    'create': True,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                    },
                },
                {
                    'name': 'data',
                    'expose': True,
                    'create': True,
                    'mutable': False
                }
            ),
            parent_model=Sample,
            url='timeseries'
        )
