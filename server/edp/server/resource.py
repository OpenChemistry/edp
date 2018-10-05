import cherrypy

from girder.api.rest import Resource
from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.api.rest import Resource, RestException, boundHandler
from girder.constants import AccessType, TokenScope
from girder.models.file import File


def _add_parents(des, parent_models):
    for parent_model in parent_models:
        parent_name = parent_model.__name__.lower()
        parent_id = '%sId' % parent_name
        des.modelParam(parent_id, 'The %s id' % parent_name,
                    model=parent_model, destName=parent_name,
                    level=AccessType.READ, paramType='path')

def _create_description(parent_models, model):
    name = model.__name__.lower()
    des = Description('Create %s.' % name)
    _add_parents(des, parent_models)
    des.jsonParam('props', 'The %s' % name, required=True, paramType='body')

    return des

def _find_description(parent_models, model):
    name = model.__name__.lower()
    des= Description('Find %s.' % name)
    _add_parents(des, parent_models)
    des.param('owner', 'The owner to return %ss for.' % name , required=False)

    return des

def _get_description(parent_models, model):
    name = model.__name__.lower()
    des = Description('Get %s.' % name)
    _add_parents(des, parent_models)
    model_id = '%sId' % name
    des.modelParam(model_id, 'The %s id' % name,
                model=model, destName=name,
                level=AccessType.WRITE, paramType='path')

    return des

def _update_description(parent_models, model):
    name = model.__name__.lower()
    des = Description('Update %s.' % name)
    _add_parents(des, parent_models)
    model_id = '%sId' % name
    des.modelParam(model_id, 'The %s id' % name,
                model=model, destName=name,
                level=AccessType.WRITE, paramType='path')

    des.jsonParam('updates', 'The %s updates' % name, required=True, paramType='body')

    return des

def _delete_description(parent_models, model):
    name = model.__name__.lower()
    des = Description('Delete %s.' % name)
    _add_parents(des, parent_models)
    model_id = '%sId' % name
    des.modelParam(model_id, 'The %s id' % name,
                model=model, destName=name,
                level=AccessType.WRITE, paramType='path')

    return des

def create(model):
    parent_models = []
    current_model = model
    while current_model().parent_model is not None:
        current_model = current_model().parent_model
        parent_models.insert(0, current_model)

    name = model.__name__.lower()
    resource_name = '%ss' % name


    class _Resource(Resource):
        def _extract_parents(self, kwargs):
            parents = []
            for m in parent_models:
                parents.append(kwargs[m.__name__.lower()])

            return parents

        def _validate_parents(self, instance, model, parents):
            parent = parents[0]
            parent_model = parent_models[0]
            for i, m in zip(parents[1:] + [instance], parent_models[1:]+[model]):
                if i[m().parent_key] != parent['_id']:
                    raise RestException('Invalid %s or %s id (%s, %s).' % (
                        parent_model.__name__.lower(), m.__name__.lower(), parent['_id'], i['_id']))
                parent = i
                parent_model = m

        @access.user(scope=TokenScope.DATA_WRITE)
        @autoDescribeRoute(
             _create_description(parent_models, model)
        )
        def create(self, *pargs, **kwargs):
            parents = self._extract_parents(kwargs)
            props = kwargs['props']

            self.requireParams(model().required_props, props)

            args = {}
            for prop in model().create_props:
                args[prop['name']] = props.get(prop['name'], prop.get('default'))

            args['public'] = props.get('public', False)
            args['user'] = self.getCurrentUser()
            args[model().parent_key] = parents[-1]['_id']

            instance = model().create(**args)
            #nonlocal parent_resource_name
            #nonlocal resource_name
            cherrypy.response.status = 201
            location_url = '/'
            for p, m in zip(parents, parent_models):
                parent_resource_name = '%ss' % m.__name__.lower()
                location_url += '/%s' % parent_resource_name
            cherrypy.response.headers['Location'] = '%s/%s' % (location_url, instance['_id'])

            return instance

        @access.user(scope=TokenScope.DATA_READ)
        @autoDescribeRoute(
            _find_description(parent_models, model)
        )
        def find(self, *parg, **kwargs):
            parents = self._extract_parents(kwargs)

            return list(model().find(parent=parents[-1],
                owner=kwargs.get('owner'), offset=kwargs.get('offset', 0), limit=kwargs.get('limit', 50), sort=kwargs.get('sort', False),
                user=self.getCurrentUser()))

        @access.user(scope=TokenScope.DATA_READ)
        @autoDescribeRoute(
            _get_description(parent_models, model)
        )
        def get(self, *pargs, **kwargs):
            parents = self._extract_parents(kwargs)
            instance = kwargs[name]
            self._validate_parents(instance, model, parents)


            return instance

        @access.user(scope=TokenScope.DATA_WRITE)
        @autoDescribeRoute(
            _update_description(parent_models, model)
        )
        def update(self, *pargs, **kwargs):
            parents = self._extract_parents(kwargs)
            instance = kwargs[name]
            self._validate_parents(instance, model, parents)
            updates = kwargs['updates']

            #if instance[model().parent_key] != parent['_id']:
            #    raise RestException('Invalid %s or %s id (%s, %s).' % (parent_name, name, parent['_id'], instance['_id']))

            instance = model().update(instance, updates, self.getCurrentUser(), parent=parents[-1])

            return instance

        @access.user(scope=TokenScope.DATA_WRITE)
        @autoDescribeRoute(
            _delete_description(parent_models, model)
        )
        def delete(self, *pargs, **kwargs):
            parents = self._extract_parents(kwargs)
            instance = kwargs[name]
            self._validate_parents(instance, model, parents)

            #if instance[model().parent_key] != parent['_id']:
            #    raise RestException('Invalid %s or %s id (%s, %s).' % (parent_name, name, parent['_id'], instance['_id']))

            model().remove(instance, user=self.getCurrentUser())

    return _Resource
