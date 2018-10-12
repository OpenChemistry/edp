from bson.objectid import ObjectId

from .base import Base
from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group
from girder.models.file import File


class CycleTest(Base):

    def __init__(self):
        from girder.plugins.edp.models.batch import Batch
        super(CycleTest, self).__init__(
            name='edp.cycletests',
            props=(
                {
                    'name': '_id',
                    'expose': True
                },
                {
                    'name': 'batchId',
                    'expose': True,
                    'create': True,
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
                    'mutable': True,
                    'required': True
                },
                {
                    'name': 'batteryType',
                    'expose': True,
                    'ensureIndex': True,
                    'create': True,
                    'mutable': True,
                    'required': True
                },
                {
                    'name': 'supplier',
                    'expose': True,
                    'ensureTextIndex': True,
                    'create': True,
                    'mutable': True
                },
                {
                    'name': 'packingDate',
                    'expose': True,
                    'ensureTextIndex': True,
                    'create': True,
                    'mutable': True
                },
                {
                    'name': 'channel',
                    'expose': True,
                    'ensureIndex': True,
                    'create': True,
                    'mutable': True,
                    'required': True
                },
                {
                    'name': 'comments',
                    'expose': True,
                    'ensureTextIndex': True,
                    'create': True,
                    'mutable': True
                },
                {
                    'name': 'scheduleFile',
                    'expose': True,
                    'create': True,
                    'mutable': True
                },
                {
                    'name': 'public',
                    'expose': True,
                    'mutable': True
                },
                {
                    'name': 'metaDataFileId',
                    'expose': True,
                    'create': True,
                    'mutable': True,
                    'type': 'file'
                },
                {
                    'name': 'dataFileId',
                    'expose': True,
                    'create': True,
                    'mutable': True,
                    'type': 'file'
                }
            ),
            parent_model=Batch,
            url='tests'
        )

    def validate(self, test):
        if 'batchId' not in test:
            raise ValidationException('Test must be associated with a batch.')

        return test

