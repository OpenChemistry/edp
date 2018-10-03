from bson.objectid import ObjectId

from .base import Base
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group

from girder.plugins.edp.models.test import Test

class Batch(Base):

    def __init__(self):
        super(Batch, self).__init__(
            name='edp.batches',
            props=(
                {
                    'name': '_id',
                    'expose': True
                },
                {
                    'name': 'startDate',
                    'expose': True,
                    'create': True
                },
                {
                    'name': 'title',
                    'expose': True,
                    'ensureIndex': True,
                    'ensureTextIndex': True,
                    'mutable': True,
                    'create': True
                },
                {
                    'name': 'motivation',
                    'expose': True,
                    'ensureTextIndex': True,
                    'mutable': True,
                    'create': True
                },
                {
                    'name': 'experimentalDesign',
                    'mutable': True,
                    'create': True
                },
                {
                    'name':'experimentalNotes',
                    'mutable': True,
                    'create': True
                },
                {
                    'name':'dataNotes',
                    'mutable': True,
                    'create': True
                },
                {
                    'name':'completed',
                    'mutable': True,
                    'default': False,
                    'create': True
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
            parent_key='projectId',
            child_model=Test
        )
