from bson.objectid import ObjectId

from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group


class Experiment(AccessControlledModel):

    def initialize(self):
        self.name = 'edp.experiments'
        self.ensureIndices(('title'))
        self.ensureTextIndex({
            'title': 1,
            'objective': 1
        })

        self.exposeFields(level=AccessType.READ, fields=(
            '_id', 'startDate', 'title', 'objective', 'public'))

    def validate(self, experiment):

        return experiment

    def create(self, start_date, title, objective, user, public=False):

        experiment = {
            'startDate': start_date,
            'title': title,
            'objective': objective,
            'owner': user['_id']
        }

        self.setPublic(experiment, public=public)
        self.setUserAccess(experiment, user=user, level=AccessType.ADMIN)

        return self.save(experiment)

    def update(self, experiment, experiment_updates, user):

        query = {
            '_id': experiment['_id']
        }
        updates = {}

        mutable_props = ['startDate', 'title', 'objective', 'public']

        for prop in experiment_updates:
            if prop in mutable_props:
                updates.setdefault('$set', {})[prop] = experiment_updates[prop]

        if updates:
            update_result = super(Experiment, self).update(query, update=updates, multi=False)
            if update_result.matched_count == 0:
                raise ValidationException('Invalid experiment id (%)' % experiment['_id'])

            return self.load(experiment['_id'], user=user, level=AccessType.READ)

        return experiment

    def find(self, owner=None, force=False, offset=0, limit=None, sort=None,
             user=None):
        query = {}

        if owner is not None:
            query['owner'] = ObjectId(owner)

        cursor = super(Experiment, self).find(query=query, offset=offset,
                                              sort=sort, user=user)

        if not force:
            for r in self.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset):
                yield r
        else:
            for r  in cursor:
                yield r

