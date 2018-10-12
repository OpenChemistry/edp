from girder.api.rest import Prefix
from .project import Project
from .search import Search

def load(info):
    info['apiRoot'].edp = Prefix()
    info['apiRoot'].edp.search = Search()
    info['apiRoot'].edp.projects = Project()
