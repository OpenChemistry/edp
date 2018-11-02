from .base import Base


class TimeSeries(Base):

    def __init__(self):
        from girder.plugins.edp.models.project import Project
        super(TimeSeries, self).__init__(
            name='edp.timeseries',
            props=(
                {
                    'name': 'projectId',
                    'create': True
                },
                {
                    'name': 'data',
                    'expose': True,
                    'create': True,
                    'mutable': False
                }
            ),
            paging_key='timeseriesId',
            parent_model=Project,
            url='timeseries'
        )
