from bson.objectid import ObjectId

from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group


class Batch(AccessControlledModel):

    def initialize(self):
        self.name = 'edp.batches'
        self.ensureIndices(('title'))
        self.ensureTextIndex({
            'title': 1,
            'motivation': 1,
            'experimentalDesign': 1,
            'experimentalNotes': 1,
            'dataNotes': 1,
            'completed': 1
        })

        self.exposeFields(level=AccessType.READ, fields=(
            '_id', 'startDate', 'title', 'motivation', 'experimentalDesign',
            'experimentalNotes', 'dataNotes', 'completed', 'public'))

    def validate(self, experiment):

        return experiment

    def create(self, experiment, start_date, title, motivation, experimental_design,
               experimental_notes, data_notes, completed, user, public=False):

        experiment = {
            'experimentId': experiment['_id'],
            'startDate': start_date,
            'title': title,
            'motivation': motivation,
            'experimentalDesign': experimental_design,
            'experimentalNotes': experimental_notes,
            'dataNotes': data_notes,
            'completed': completed,
            'owner': user['_id']
        }

        self.setPublic(experiment, public=public)
        self.setUserAccess(experiment, user=user, level=AccessType.ADMIN)

        return self.save(experiment)

    def update(self, batch, batch_updates, user):

        query = {
            '_id': batch['_id']
        }
        updates = {}

        mutable_props = ['startDate', 'title', 'motivation', 'experimentalDesign',
                         'experimentalNotes', 'dataNotes', 'completed', 'public']

        for prop in batch_updates:
            if prop in mutable_props:
                updates.setdefault('$set', {})[prop] = batch_updates[prop]

        if updates:
            update_result = super(Batch, self).update(query, update=updates, multi=False)
            if update_result.matched_count == 0:
                raise ValidationException('Invalid batch id (%)' % batch['_id'])

            return self.load(batch['_id'], user=user, level=AccessType.READ)

        return batch

    def find(self, experiment=None, owner=None, force=False, offset=0, limit=None,
             sort=None, user=None):
        query = {}

        if owner is not None:
            query['owner'] = ObjectId(owner)

        if experiment is not None:
            query['experimentId'] = experiment['_id']

        cursor = super(Batch, self).find(query=query, offset=offset,
                                              sort=sort, user=user)

        if not force:
            for r in self.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset):
                yield r
        else:
            for r  in cursor:
                yield r
