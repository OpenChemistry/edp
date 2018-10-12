from .base import Base


class Postmortem(Base):

    def __init__(self):
        from girder.plugins.edp.models.project import Project
        from girder.plugins.edp.models.postmortemtest import PostmortemTest
        super(Postmortem, self).__init__(
            name='edp.postmortem',
            props=(
                {
                    'name': 'startDate',
                    'expose': True,
                    'create': True,
                    'mutable': True
                },
                {
                    'name': 'title',
                    'expose': True,
                    'ensureIndex': True,
                    'create': True,
                    'mutable': True
                },
                {
                    'name': 'comments',
                    'expose': True,
                    'ensureTextIndex': True,
                    'create': True,
                    'mutable': True
                },
                {
                    'name':'public',
                    'mutable': True,
                    'create': True

                },
                {
                    'name': 'projectId',
                    'create': True
                }

            ),
            parent_model=Project,
            child_model=PostmortemTest,
            url='postmortems'
        )
