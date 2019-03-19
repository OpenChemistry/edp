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
        config = {
            'deployment': Setting().get(constants.CONFIGURATION_DEPLOYMENT),
            'license': Setting().get(constants.CONFIGURATION_LICENSE),
            'privacy': Setting().get(constants.CONFIGURATION_PRIVACY),
        }

        if Setting().get(constants.CONFIGURATION_LOGO_ID) is not None:
            config['logoId'] = Setting().get(constants.CONFIGURATION_LOGO_ID)

        if Setting().get(constants.CONFIGURATION_FAVICON_ID) is not None:
            config['faviconId'] = Setting().get(constants.CONFIGURATION_FAVICON_ID)

        return config
