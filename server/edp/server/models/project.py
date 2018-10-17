from bson.objectid import ObjectId

from girder.models.model_base import AccessControlledModel
from girder.constants import AccessType
from girder.models.model_base import ValidationException
from girder.models.group import Group

from girder.plugins.edp.models.cycle import Cycle
from girder.plugins.edp.models.postmortem import Postmortem

from . import edp_group


class Project(AccessControlledModel):

    def __init__(self):
        super(Project, self).__init__()
        self.parent_model = None
        self.parent_key = None
        self.url = 'projects'

    def initialize(self):
        self.name = 'edp.projects'
        self.ensureIndices(('title'))
        self.ensureTextIndex({
            'title': 1,
            'objective': 1,
            'motivation': 1
        })

        self.exposeFields(level=AccessType.READ, fields=(
            '_id', 'startDate', 'title', 'objective', 'motivation', 'public'))

    def validate(self, project):

        return project

    def create(self, start_date, title, objective, motivation, user, public=False):

        project = {
            'startDate': start_date,
            'title': title,
            'objective': objective,
            'motivation': motivation,
            'owner': user['_id']
        }

        self.setPublic(project, public=public)
        self.setUserAccess(project, user=user, level=AccessType.ADMIN)
        if edp_group() is not None:
            self.setGroupAccess(project, edp_group(), AccessType.ADMIN)

        return self.save(project)

    def update(self, project, project_updates, user):

        query = {
            '_id': project['_id']
        }
        updates = {}

        mutable_props = ['startDate', 'title', 'objective', 'motivation', 'public']

        for prop in project_updates:
            if prop in mutable_props:
                updates.setdefault('$set', {})[prop] = project_updates[prop]

        if updates:
            update_result = super(Project, self).update(query, update=updates, multi=False)
            if update_result.matched_count == 0:
                raise ValidationException('Invalid project id (%)' % project['_id'])

            return self.load(project['_id'], user=user, level=AccessType.READ)

        return project

    def find(self, owner=None, force=False, offset=0, limit=None, sort=None,
             user=None):
        query = {}

        if owner is not None:
            query['owner'] = ObjectId(owner)

        cursor = super(Project, self).find(query=query, offset=offset,
                                              sort=sort, user=user)

        if not force:
            for r in self.filterResultsByPermission(cursor=cursor, user=user,
                                                    level=AccessType.READ,
                                                    limit=limit, offset=offset):
                yield r
        else:
            for r  in cursor:
                yield r

    def remove(self, project, user=None, force=False):
        super(Project, self).remove(project)

        for cycle in Cycle().find(project, force=True):
            if not force and not self.hasAccess(cycle, user=user, level=AccessType.WRITE):
                raise ValidationException('Unable to remove cycle associated with project.')

            Cycle().remove(cycle, user)

        for postmortem in Postmortem().find(project, force=True):
            if not force and not self.hasAccess(cycle, user=user, level=AccessType.WRITE):
                raise ValidationException('Unable to remove cycle associated with project.')

            Postmortem().remove(postmortem, user)
