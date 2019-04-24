import json
from pymongo import MongoClient
from bson.objectid import ObjectId

client = MongoClient('mongodb://localhost:27017/')
db = client.girder
runs = db['edp.runs']
platemaps = db['edp.platemaps']

elements = ['mn']


# Find the matching runs
match_runs = {
    'compositeId': ObjectId('5cbf75d6260791165186f6e2')
}

ph = '13.7'
electrolyte = 'NaOH(aq)'
plateId = None#5143

if ph is not None:
    match_runs['solutionPh'] = float(ph)

if electrolyte is not None:
    match_runs['electrolyte'] = electrolyte

if plateId is not None:
    match_runs['plateId'] = int(plateId)

match_runs = {
    '$match': match_runs
}

lookup_platemaps_match = {
    '$expr': {
        '$and': [{
            '$eq': ["$plateId",  "$$plateId"]
        }]
    }
}

if elements:
    lookup_platemaps_match['$expr']['$and'].append({
        '$setIsSubset': [elements, '$elements']
    })

lookup_platemaps =   {
    '$lookup':{
       'from': 'edp.platemaps',
       'let': {
           'plateId': '$plateId'
        },
       'pipeline': [{
           '$match': lookup_platemaps_match
       }],
       'as': 'platemap'
     }
}

unwind_platemap = {
    '$unwind': '$platemap'
}

lookup_analyses_match = {
    '$expr': {
        '$in': ['$$plateId', '$plateIds']
    }
}

lookup_analyses =  {
    '$lookup':{
       'from': 'edp.analyses',
       'let': {
          'plateId': '$plateId'
        },
       'pipeline': [{
           '$match': lookup_analyses_match
       }],
       'as': 'analyses'
    }
}

unwind_analyses = {
    '$unwind': '$analyses'
}

group_by_analyses = {
    '$group': {
        '_id': {
            '_id': '$analyses._id',
            'name': '$analyses.name',
            'timestamp': '$analyses.timestamp'
        },
        'plateId': {
            '$addToSet': '$plateId'
        },
        'solutionPh': {
            '$addToSet': '$solutionPh'
        },
        'electrolyte': {
            '$addToSet': '$electrolyte'
        },
        'runId': {
            '$addToSet': '$runId'
        },
        'elements': {
            '$addToSet': '$platemap.elements'
        }

    }
}

project = {
    '$project': {
        '_id': 0,
        'analysis': '$_id',
        'plateId': 1,
        'solutionPh': 1,
        'electrolyte': 1,
        'runId': 1,
        'elements': {
            '$reduce': {
                'input': "$elements",
                'initialValue': [],
                'in': {
                    '$setUnion' : ['$$value', '$$this']
                }
            }
        }
    }
}


import json

pipeline = [match_runs, lookup_platemaps, unwind_platemap, lookup_analyses, unwind_analyses, group_by_analyses, project]#, project]
sample_sets = runs.aggregate(pipeline)

#print(len(list(sample_sets)))
print(json.dumps(list(sample_sets)[0], indent=2, default=str))
