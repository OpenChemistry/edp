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

        if Setting().get(constants.CONFIGURATION_HEADER_LEFT_LOGO_ID) is not None:
            config['headerLeftLogoFileId'] = Setting().get(constants.CONFIGURATION_HEADER_LEFT_LOGO_ID)

        if Setting().get(constants.CONFIGURATION_HEADER_RIGHT_LOGO_ID) is not None:
                    config['headerRightLogoFileId'] = Setting().get(constants.CONFIGURATION_HEADER_RIGHT_LOGO_ID)

        if Setting().get(constants.CONFIGURATION_HEADER_RIGHT_LOGO_URL) is not None:
                            config['headerRightLogoUrl'] = Setting().get(constants.CONFIGURATION_HEADER_RIGHT_LOGO_URL)

        if Setting().get(constants.CONFIGURATION_FAVICON_ID) is not None:
            config['faviconFileId'] = Setting().get(constants.CONFIGURATION_FAVICON_ID)

        if Setting().get(constants.CONFIGURATION_FOOTER_LOGO_ID) is not None:
            config['footerLogoFileId'] = Setting().get(constants.CONFIGURATION_FOOTER_LOGO_ID)

        if Setting().get(constants.CONFIGURATION_FOOTER_LOGO_URL) is not None:
            config['footerLogoUrl'] = Setting().get(constants.CONFIGURATION_FOOTER_LOGO_URL)


        return config
