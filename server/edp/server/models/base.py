from bson.objectid import ObjectId

from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group
from girder.models.file import File
from girder.api.rest import getCurrentUser

class Base(AccessControlledModel):

    def __init__(self, name=None, props=None, parent_key=None, child_model=None):
        print('NAME: %s' % name)
        self.collection_name = name
        self.ensure_indices = [ p['name'] for p in props if p.get('ensure_index')]
        self.ensure_text_indices = [ p['name'] for p in props if p.get('ensure_text_index')]
        self.expose_fields = [ p['name'] for p in props if p.get('expose')]
        self.mutable_props = [ p['name'] for p in props if p.get('mutable')]
        self.create_props = [ p for p in props if p.get('create')]
        self.file_props = [ p['name'] for p in props if p.get('type') == 'file']
        self.parent_key = parent_key
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

        return self.save(model)

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

                updates.setdefault('$set', {})[prop] = prop_value

        if updates:
            update_result = super(Base, self).update(query, update=updates, multi=False)
            if update_result.matched_count == 0:
                raise ValidationException('Invalid id (%s)' % model['_id'])

            return self.load(model['_id'], user=user, level=AccessType.READ)

        return model

    def find(self, parent=None, owner=None, force=False, offset=0, limit=None,
             sort=None, user=None):
        query = {}

        if owner is not None:
            query['owner'] = ObjectId(owner)

        if parent is not None:
            query[self.parent_key] = parent['_id']

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
