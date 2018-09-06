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
            '_id', 'startDate', 'cellId', 'channel', 'comments', 'scheduleFile', 'public'))

    def validate(self, test):
        if 'batchId' not in test:
            raise ValidationException('Test must be associated with a batch.')

        return test

    def create(self, batch, start_date, cell_id, channel, comments,
               schedule_file, meta_data_file_id, data_file_id, user, public=False):

        test = {
            'batchId': batch['_id'],
            'startDate': start_date,
            'cellId': cell_id,
            'channel': channel,
            'comments': comments,
            'scheduleFile': schedule_file,
            'owner': user['_id']
        }

        file_args = {
            'metaDataFileId': meta_data_file_id,
            'dataFileId': data_file_id
        }

        for key, fileId in file_args.items():
            if fileId is not None:
                file = File().load(fileId, user=getCurrentUser(),
                        level=AccessType.READ)
                if file is None:
                    raise ValidationException('File doesn\'t exists: %s' % fileId)
                test[key] = fileId

        self.setPublic(test, public=public)
        self.setUserAccess(test, user=user, level=AccessType.ADMIN)

        return self.save(test)

    def update(self, batch, test, test_updates, user):
        query = {
            '_id': test['_id'],
            'batchId': batch['_id']
        }
        updates = {}

        file_props = ['metaDataFileId', 'dataFileId']
        mutable_props = ['startDate', 'cellId', 'channel',
                         'comments', 'scheduleFile', 'public'] + file_props

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
                raise ValidationException('Invalid batch or test id (%s, %s)' %
                    (batch['_id'], test['_id']))

            return self.load(test['_id'], user=user, level=AccessType.READ)

        return test

    def find(self, batch, force=False, offset=0, limit=None, sort=None,
             user=None):

        query = {
            'batchId': batch['_id']
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

