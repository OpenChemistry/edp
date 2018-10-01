from girder.api.rest import Prefix
from .project import Project

def load(info):
    info['apiRoot'].edp = Prefix()
    info['apiRoot'].edp.projects = Project()
