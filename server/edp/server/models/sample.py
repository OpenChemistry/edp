from .base import Base
from bson.objectid import ObjectId


class Sample(Base):

    def __init__(self):
        from girder.plugins.edp.models.project import Project
        super(Sample, self).__init__(
            name='edp.samples',
            props=(
                {
                    'name': 'runId',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                     },
                    'type': ObjectId
                },
                {
                    'name': 'sampleNum',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True
                },
                {
                    'name': 'composition',
                    'expose': True,
                    'create': True,
                    'mutable': False
                },
                {
                    'name': 'scalars',
                    'expose': True,
                    'create': True,
                    'mutable': False
                },
                {
                    'name': 'timeseriesId',
                    'expose': False,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'type': ObjectId

                },
                {
                    'name': 'plateMapId',
                    'expose': False,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                     },
                    'type': ObjectId

                },
                {
                    'name': 'projectId',
                    'create': True,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                     },
                }
            ),
            paging_key='sampleId',
            parent_model=Project,
            url='samples'
        )
