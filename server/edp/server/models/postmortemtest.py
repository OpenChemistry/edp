from bson.objectid import ObjectId

from .base import Base
from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group
from girder.models.file import File


class PostmortemTest(Base):

    def __init__(self):
        from girder.plugins.edp.models.postmortem import Postmortem
        super(PostmortemTest, self).__init__(
            name='edp.postmortemtests',
            props=(
                {
                    'name': '_id',
                    'expose': True
                },
                {
                    'name': 'startDate',
                    'expose': True,
                    'create': True,
                    'mutable': True
                },
                {
                    'name': 'cellId',
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
                    'name': 'imageFileId',
                    'expose': True,
                    'create': True,
                    'mutable': True,
                    'type': 'file'
                },
                {
                    'name': 'postmortemId',
                    'expose': True,
                    'create': True,
                },

            ),
            parent_model=Postmortem,
            url='tests'
        )
