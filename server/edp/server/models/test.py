from bson.objectid import ObjectId

from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group
from girder.models.file import File
from girder.api.rest import getCurrentUser


class Test(AccessControlledModel):

    def initialize(self):
        self.name = 'edp.tests'
        self.ensureIndices(('cellId', 'channel'))
        self.ensureTextIndex({
            'comments': 1
        })

        self.exposeFields(level=AccessType.READ, fields=(
            '_id', 'startDate', 'cellId', 'channel', 'comments', 'public'))

    def validate(self, test):
        if 'experimentId' not in test:
            raise ValidationException('Test must be associated with an experiment.')

        return test

    def create(self, experiment, start_date, cell_id, channel, comments,
               user, public=False):

        test = {
            'experimentId': experiment['_id'],
            'startDate': start_date,
            'cellId': cell_id,
            'channel': channel,
            'comments': comments,
            'owner': user['_id']
        }

        self.setPublic(test, public=public)
        self.setUserAccess(test, user=user, level=AccessType.ADMIN)

        return self.save(test)

    def update(self, experiment, test, test_updates, user):
        query = {
            '_id': test['_id'],
            'experimentId': experiment['_id']
        }
        updates = {}

        file_props = ['scheduleFileId', 'metaDataFileId', 'dataFileId']
        mutable_props = ['startDate', 'cellId', 'channel', 'experimentId',
                         'comments', 'public'] + file_props

        for prop in test_updates:
            if prop in mutable_props:
                value = test_updates[prop]
                # Check the file exists
                if prop in file_props:
                    file = File().load(value, user=getCurrentUser(),
                                       level=AccessType.READ)
                    if file is None:
                        raise ValidationException('File doesn\'t exists: %s' % value)
                    value = file['_id']

                updates.setdefault('$set', {})[prop] = value

        if updates:
            update_result = super(Test, self).update(query, update=updates, multi=False)
            if update_result.matched_count == 0:
                raise ValidationException('Invalid experiment or test id (%s, %s)' %
                    (experiment['_id'], test['_id']))

            return self.load(test['_id'], user=user, level=AccessType.READ)

        return test

    def find(self, experiment, force=False, offset=0, limit=None, sort=None,
             user=None):

        query = {
            'experimentId': experiment['_id']
        }

        cursor = super(Test, self).find(query=query, offset=offset,
                                              sort=sort, user=user)

        if not force:
            for r in self.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset):
                yield r
        else:
            for r  in cursor:
                yield r

