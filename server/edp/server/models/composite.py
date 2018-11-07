from .base import Base


class Composite(Base):

    def __init__(self):
        from girder.plugins.edp.models.project import Project
        super(Composite, self).__init__(
            name='edp.composites',
            props=(
                {
                    'name': 'name',
                    'expose': True,
                    'create': True,
                    'mutable': True
                },
                {
                    'name': 'projectId',
                    'create': True
                }
            ),
            parent_model=Project,
            url='composites'
        )
