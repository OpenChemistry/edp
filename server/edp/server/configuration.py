from girder.api import access
from girder.api.describe import Description, autoDescribeRoute
from girder.constants import TokenScope
from . import constants
from girder.models.setting import Setting
from girder.api.rest import Resource

class Configuration(Resource):

    def __init__(self):
        super(Configuration, self).__init__()
        self.route('GET', (), self.get)

    @access.public(scope=TokenScope.DATA_READ)
    @autoDescribeRoute(
        Description('Get the site configuration.')
    )
    def get(self):
        return {
            'deployment': Setting().get(constants.CONFIGURATION_DEPLOYMENT),
            'license': Setting().get(constants.CONFIGURATION_LICENSE),
            'privacy': Setting().get(constants.CONFIGURATION_PRIVACY),

        }
