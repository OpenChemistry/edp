from .base import Base


class Run(Base):

    def __init__(self):
        from girder.plugins.edp.models.composite import Composite
        super(Run, self).__init__(
            name='edp.runs',
            props=(
                {
                    'name': 'solutionPh',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                     },
                    'type': float
                },
                {
                    'name': 'plateId',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                     },
                },
                {
                    'name': 'electrolyte',
                    'expose': True,
                    'create': True,
                    'mutable': False,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                     },
                },
                {
                    'name': 'compositeId',
                    'create': True,
                    'ensure_index': True,
                    'query': {
                        'selector': '$eq'
                    },
                }
            ),
            parent_model=Composite,
            url='runs'
        )
