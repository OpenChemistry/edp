from girder.api.rest import Prefix
from .rest import Experiment

def load(info):
    info['apiRoot'].edp = Prefix()
    info['apiRoot'].edp.experiments = Experiment()
