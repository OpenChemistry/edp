import re

from bson.objectid import ObjectId

from girder import events
from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group
from girder.models.file import File
from girder.models.item import Item
from girder.api.rest import getCurrentUser
from girder.plugins.jobs.models.job import Job
from girder.plugins.jobs.constants import JobStatus

from . import edp_group

class Base(AccessControlledModel):

    def __init__(self, name=None, props=None, parent_model=None, child_model=None, url=''):
        self.collection_name = name
        self.ensure_indices = [ p['name'] for p in props if p.get('ensure_index')]
        self.ensure_text_indices = [ p['name'] for p in props if p.get('ensure_text_index')]
        self.expose_fields = [ p['name'] for p in props if p.get('expose')]
        self.mutable_props = [ p['name'] for p in props if p.get('mutable')]
        self.create_props = [ p for p in props if p.get('create')]
        self.file_props = [ p['name'] for p in props if p.get('type') == 'file']
        self.required_props = [ p['name'] for p in props if p.get('required')]
        self.parent_model = parent_model
        self.url = url
        if self.parent_model is not None:
            self.parent_key = '%sId' % self.parent_model.__name__.lower()

        self.child_model = child_model

        super(Base, self).__init__()


    def initialize(self):
        self.name = self.collection_name
        self.ensureIndices(self.ensure_indices)
        self.ensureTextIndex(self.ensure_text_indices)

        self.exposeFields(level=AccessType.READ, fields=self.expose_fields + ['owner'])

    def validate(self, model):

        return model

    def create(self, **kwargs):

        model = {}
        for prop in self.create_props:
            prop_value = kwargs.get(prop['name'], prop.get('default'))
            if prop_value is not None and prop.get('type') == 'file':
                file = File().load(prop_value, user=getCurrentUser(),
                        level=AccessType.READ)
                if file is None:
                    raise ValidationException('File doesn\'t exists: %s' % prop_value)

                if not isinstance(prop_value, ObjectId):
                    prop_value = ObjectId(prop_value)

            if prop_value is not None:
                model[prop['name']] = prop_value

        self.setPublic(model, public=kwargs.get('public', False))
        user = kwargs.get('user')
        self.setUserAccess(model, user=user, level=AccessType.ADMIN)
        model['owner'] = user['_id']
        if edp_group() is not None:
            self.setGroupAccess(model, edp_group(), AccessType.ADMIN)

        saved_model = self.save(model)

        # Now spawn thumbnail jobs if the model contains any image
        for prop in self.create_props:
            prop_value = kwargs.get(prop['name'], prop.get('default'))
            if prop_value is not None and prop.get('type') == 'file':
                file = File().load(prop_value, user=getCurrentUser(),
                        level=AccessType.READ)
                mime_type = file.get('mimeType', '')
                if mime_type is not None and  mime_type.startswith('image/'):
                    self._create_thumbnail(file, saved_model, prop['name'], user)

        return saved_model

    def update(self, model, model_updates, user, parent=None):

        query = {
            '_id': model['_id']
        }
        if self.parent_key is not None:
            query[self.parent_key] = parent['_id']
        updates = {}

        for prop in model_updates:
            if prop in self.mutable_props:
                prop_value = model_updates[prop]
                if prop in self.file_props:
                    file = File().load(prop_value, user=getCurrentUser(),
                                       level=AccessType.READ)
                    if file is None:
                        raise ValidationException('File doesn\'t exists: %s' % prop_value)

                    if not isinstance(prop_value, ObjectId):
                        prop_value = ObjectId(prop_value)

                    mime_type = file.get('mimeType', '')
                    if mime_type is not None and  mime_type.startswith('image/'):
                        self._create_thumbnail(file, model, prop, user, updates)

                updates.setdefault('$set', {})[prop] = prop_value

        if updates:
            update_result = super(Base, self).update(query, update=updates, multi=False)
            if update_result.matched_count == 0:
                raise ValidationException('Invalid id (%s)' % model['_id'])

            return self.load(model['_id'], user=user, level=AccessType.READ)

        return model

    def _create_thumbnail(self, file, model, prop, user, updates=None):
        max_height = 320

        file_id = file['_id']
        model_id = model['_id']
        prop_name = prop + 'Thumbnail'
        # clear the previous thumbnail
        if updates is not None:
            updates.setdefault('$unset', {})[prop_name] = 1

        events.bind('jobs.job.update.after', str(file_id), callback_factory(self, prop_name, file_id, model_id, user))
        job = schedule_thumbnail_job(file, 'item', file['itemId'], user, height=max_height, async=True)

    def find(self, parent=None, owner=None, fields=None, force=False, offset=0, limit=None,
             sort=None, user=None):
        query = {}

        if owner is not None:
            query['owner'] = ObjectId(owner)

        if parent is not None:
            query[self.parent_key] = parent['_id']

        if fields is not None:
            for key, value in fields.items():
                if value is not None:
                    regex = re.compile('.*%s.*' % value, re.IGNORECASE)
                    query[key] = {
                        '$regex': regex
                    }

        cursor = super(Base, self).find(query=query, offset=offset,
                                              sort=sort, user=user)

        if not force:
            for r in self.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset):
                yield r
        else:
            for r  in cursor:
                yield r

    def remove(self, model, user=None, force=False):
        super(Base, self).remove(model)

        if self.child_model is not None:
            for child in self.child_model().find(model, force=True):
                if not force and not self.hasAccess(model, user=user, level=AccessType.WRITE):
                    raise ValidationException('Unable to remove child.')

                self.child_model().remove(child, user)

        # Now remove any file we have associated with this model
        for prop in self.file_props:
            if prop in model:
                file = File().load(model[prop], level=AccessType.WRITE, user=user)
                File().remove(file)

def schedule_thumbnail_job(file, attachToType, attachToId, user, width=0, height=0, crop=True, async=False):
    """
    Schedule a local thumbnail creation job and return it.
    """
    job = Job().createLocalJob(
        title='Generate thumbnail for %s' % file['name'], user=user, type='thumbnails.create',
        public=False, module='girder.plugins.thumbnails.worker', kwargs={
            'fileId': str(file['_id']),
            'width': width,
            'height': height,
            'crop': crop,
            'attachToType': attachToType,
            'attachToId': str(attachToId)
        },
        async=async)
    Job().scheduleJob(job)
    return job


def callback_factory(self, prop_name, file_id, model_id, user):

    def callback(event):
        job = event.info['job']

        if job['kwargs'].get('fileId') != str(file_id):
            return

        SUCCESS = JobStatus.SUCCESS
        ERROR = JobStatus.ERROR
        CANCELED = JobStatus.CANCELED

        if job['status'] == SUCCESS:
            item_id = job['kwargs']['attachToId']
            item = Item().load(item_id, user=user, level=AccessType.READ)
            thumbnails = item.get("_thumbnails", [])

            if len(thumbnails) > 0:
                thumbnail_id = thumbnails.pop()

                # remove old thumbnails
                if len(thumbnails) > 0:
                    Item().update({'_id': item_id}, {'$set': {'_thumbnails': [thumbnail_id]}})
                    for thumb_id in thumbnails:
                        file = File().load(thumb_id, user=user, level=AccessType.WRITE)
                        File().remove(file)

                query = {
                    '_id': model_id
                }
                updates = {}
                updates.setdefault('$set', {})[prop_name] = thumbnail_id
                update_result = super(Base, self).update(query, updates)
                if update_result.matched_count == 0:
                    raise ValidationException('Invalid id (%s)' % model_id)

        if job['status'] in [SUCCESS, ERROR, CANCELED]:
            events.unbind('jobs.job.update.after', str(file_id))

        return

    return callback
