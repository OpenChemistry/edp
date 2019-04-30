from .base import Base
from bson.objectid import ObjectId


class Analysis(Base):

    def __init__(self):
        from girder.plugins.edp.models.composite import Composite
        super(Analysis, self).__init__(
            name='edp.analyses',
            props=(
                {
                    'name': 'type',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                },
                {
                    'name': 'name',
                    'expose': True,
                    'create': True,
                    'mutable': False
                },
                {
                    'name': 'index',
                    'expose': True,
                    'create': True,
                    'mutable': False
                },
                {
                    'name': 'timestamp',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'type': 'timestamp'
                },
                {
                    'name': 'technique',
                    'expose': True,
                    'create': True,
                    'mutable': False
                },
                {
                    'name': 'plateIds',
                    'expose': True,
                    'create': True,
                    'mutable': False
                }
            ),
            parent_model=Composite,
            url='analyses'
        )
