from bson.objectid import ObjectId

from .base import Base
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group

from girder.plugins.edp.models.cycletest import CycleTest

class Batch(Base):

    def __init__(self):
        from girder.plugins.edp.models.cycle import Cycle
        from girder.plugins.edp.models.project import Project
        from girder.plugins.edp import constants
        from girder.models.setting import Setting

        deployment = Setting().get(constants.CONFIGURATION_DEPLOYMENT)
        parent_id = 'cycleId'
        parent_model  = Cycle
        if deployment == constants.SOW10_DEPLOYMENT:
            parent_id = 'projectId'
            parent_model = Project

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
                    'create': True,
                    'required': True
                },
                {
                    'name': 'title',
                    'expose': True,
                    'ensureIndex': True,
                    'ensureTextIndex': True,
                    'mutable': True,
                    'create': True,
                    'required': True
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
                    'create': True,
                    'required': True
                },
                {
                    'name':'experimentalNotes',
                    'mutable': True,
                    'create': True,
                    'required': True
                },
                {
                    'name':'dataNotes',
                    'mutable': True,
                    'create': True,
                    'required': True
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
                    'name': 'structFileId',
                    'expose': True,
                    'create': True,
                    'mutable': True,
                    'type': 'file'
                },
                {
                    'name': parent_id,
                    'create': True
                }
            ),
            parent_model=parent_model,
            child_model=CycleTest,
            url='batches'
        )
