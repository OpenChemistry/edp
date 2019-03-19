from girder.api.rest import Prefix
from .project import Project
from .search import Search
from .configuration import Configuration
from . import constants
from girder.utility import setting_utilities

@setting_utilities.validator({
    constants.CONFIGURATION_DEPLOYMENT,
    constants.CONFIGURATION_LICENSE,
    constants.CONFIGURATION_PRIVACY,
    constants.CONFIGURATION_FAVICON_ID,
    constants.CONFIGURATION_LOGO_ID
})
def validateSettings(event):
    pass

def load(info):
    info['apiRoot'].edp = Prefix()
    info['apiRoot'].edp.search = Search()
    info['apiRoot'].edp.projects = Project()
    info['apiRoot'].edp.configuration = Configuration()
