import cherrypy

from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException
from girder.constants import AccessType, TokenScope
from girder.models.file import File

from . import resource
from girder.plugins.edp.models.project import Project as ProjectModel
from girder.plugins.edp.models.batch import Batch as BatchModel
from girder.plugins.edp.models.cycletest import CycleTest as CycleTestModel
from girder.plugins.edp.models.cycle import Cycle as CycleModel
from girder.plugins.edp.models.postmortem import Postmortem as PostmortemModel
from girder.plugins.edp.models.postmortemtest import PostmortemTest as PostmortemTestModel

class Search(Resource):

    def __init__(self):
        super(Search, self).__init__()
        self.route('GET', (), self.global_search)

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Search models by fields.')
        .param('title', 'Search batches by title', required=False)
        .param('cellId', 'Search tests by cellId', required=False)
        .param('supplier', 'Search tests by supplier', required=False)
        .pagingParams(defaultSort=None)
    )
    def global_search(self, title=None, cellId=None, supplier=None, offset=0,
                      limit=None, sort=None):
        fields = {
            'title': title,
            'cellId': cellId,
            'supplier': supplier
        }

        models = [
            BatchModel,
            CycleTestModel,
            PostmortemModel,
            PostmortemTestModel
        ]

        tree_items = {
            'root': {
                'item': None,
                'children': []
            }
        }

        def _make_absolute_path(item, model, tree_items):
            parent_model = model().parent_model
            parent_key = model().parent_key
            path = model().url + '/' + str(item['_id'])
            if parent_model is None:
                return '/%s' % path
            else :
                if str(item[parent_key]) in tree_items:
                    parent = tree_items[str(item[parent_key])]['item']
                else:
                    parent = parent_model().load(item[parent_key], 
                        level=AccessType.READ, user=self.getCurrentUser())
                    parent['path'] = _make_absolute_path(parent, parent_model, tree_items)
                    tree_items[str(parent['_id'])] = {
                        'item': parent,
                        'model': parent_model,
                        'children': []
                    }
                return '%s/%s' % (parent['path'], path)

        # Search for all the items matching these fields.
        # For each item, also include all of its ancestors

        for model in models:
            model_matches = list(model().find(fields=fields, offset=offset,
                        limit=limit, sort=sort, user=self.getCurrentUser()))
            for match in model_matches:
                if str(match['_id']) not in tree_items:
                    match['path'] = _make_absolute_path(match, model, tree_items)
                    tree_items[str(match['_id'])] = {
                        'item': match,
                        'model': model,
                        'children': []
                    }

        for _id, value in tree_items.items():
            if _id == 'root':
                continue

            model = value['model']
            item = value['item']

            parentId = 'root'
            if model().parent_model is not None:
                parentId = str(item[model().parent_key])

            tree_items[parentId]['children'].append(_id)

        return tree_items

