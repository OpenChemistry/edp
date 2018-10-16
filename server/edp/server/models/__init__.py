from girder.models.group import Group

_edp_group = None


def edp_group():
    global _edp_group

    query = {
        'lowerName': 'edp'
    }
    if _edp_group is None:
        _edp_group = Group().findOne(query)

    return _edp_group
