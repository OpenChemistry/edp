from .base import Base
from bson.objectid import ObjectId


class PlateMap(Base):

    def __init__(self):
        from girder.plugins.edp.models.composite import Composite
        from girder.plugins.edp.models.sample import Sample
        super(PlateMap, self).__init__(
            name='edp.platemaps',
            props=(
                {
                    'name': 'plateId',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                    }
                },
                {
                    'name': 'elements',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'query': {
                        'selector': '$all'
                     }
                },
                {
                    'name': 'compositeId',
                    'create': True,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                    },
                },
                {
                    'name': 'sampleIds',
                    'create': True,
                    'ensure_index': True,
                    'query': {
                        'selector': '$in'
                    },
                    'type': ObjectId
                }
            ),
            parent_model=Composite,
            url='platemaps'
        )
