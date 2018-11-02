from .base import Base


class Run(Base):

    def __init__(self):
        from girder.plugins.edp.models.project import Project
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
                    'name': 'projectId',
                    'create': True
                }
            ),
            parent_model=Project,
            url='runs'
        )
