from .base import Base
from bson.objectid import ObjectId


class PlateMap(Base):

    def __init__(self):
        from girder.plugins.edp.models.project import Project
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
                }
            ),
            parent_model=Project,
            url='platemaps'
        )
