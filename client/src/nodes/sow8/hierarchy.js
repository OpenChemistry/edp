import { has } from 'lodash-es';

import { ROOT_NODE } from '../root';

import {
  Autorenew,
  Layers,
  Folder,
  ChangeHistory,
  Crop,
  Grain
} from '@material-ui/icons';

import {
  lightBlue,
  lightGreen,
  amber,
  deepOrange,
  teal,
  indigo,
  cyan
} from '@material-ui/core/colors';

import IngestBatch from '../../containers/ingest/batch';
import IngestComposite from '../../containers/ingest/composite';
import CompositeSearch from '../../containers/composite-search';

export const PROJECT_NODE = 'PROJECT_NODE';
export const CYCLE_NODE = 'CYCLE_NODE';
export const POSTMORTEM_NODE = 'POSTMORTEM_NODE';
export const BATCH_NODE = 'BATCH_NODE';
export const TEST0_NODE = 'TEST0_NODE';
export const TEST1_NODE = 'TEST1_NODE';
export const COMPOSITION_NODE = 'COMPOSITION_NODE';

export const SAMPLE_NODE = 'SAMPLE_NODE';
export const TIMESERIE_NODE = 'TIMESERIE_NODE';

export const NODES = {
  [ROOT_NODE] : {
    label: '',
    url: '',
    children: [PROJECT_NODE],
  },
  [PROJECT_NODE] : {
    label: 'Project',
    labelPlural: 'Projects',
    url: 'projects',
    children: [CYCLE_NODE, POSTMORTEM_NODE, COMPOSITION_NODE],
    parentId: null,
    primaryField: 'title',
    secondaryField: 'startDate',
    color: indigo[500],
    icon: Folder
  },
  [CYCLE_NODE] : {
    label: 'Cycle',
    labelPlural: 'Cycles',
    url: 'cycles',
    children: [BATCH_NODE],
    parentId: 'projectId',
    primaryField: 'title',
    secondaryField: 'startDate',
    color: teal[500],
    icon: Autorenew
  },
  [BATCH_NODE] : {
    label: 'Batch',
    labelPlural: 'Batches',
    url: 'batches',
    children: [TEST0_NODE],
    parentId: 'cycleId',
    primaryField: 'title',
    secondaryField: 'startDate',
    color: deepOrange[500],
    icon: Layers,
    ingest: IngestBatch
  },
  [TEST0_NODE] : {
    label: 'Test',
    labelPlural: 'Tests',
    url: 'tests',
    children: [],
    parentId: 'batchId',
    fileFields: ['dataFile', 'metaDataFile'],
    primaryField: 'channel',
    primaryPrefix: 'Channel',
    secondaryField: 'startDate',
    color: lightBlue[500],
    icon: ChangeHistory,
    visualizationField: 'summary'
  },
  [POSTMORTEM_NODE] : {
    label: 'Postmortem',
    labelPlural: 'Postmortems',
    url: 'postmortems',
    children: [TEST1_NODE],
    parentId: 'projectId',
    primaryField: 'title',
    secondaryField: 'startDate',
    color: amber[500],
    icon: Crop
  },
  [TEST1_NODE] : {
    label: 'Test',
    labelPlural: 'Tests',
    url: 'tests',
    children: [],
    parentId: 'postmortemId',
    fileFields: ['imageFile'],
    primaryField: 'cellId',
    secondaryField: 'startDate',
    color: lightGreen[500],
    icon: ChangeHistory
  },
  [COMPOSITION_NODE] : {
    label: 'Composite',
    labelPlural: 'Composites',
    url: 'composites',
    children: [],
    parentId: 'projectId',
    primaryField: 'name',
    color: cyan[500],
    icon: Grain,
    viewComponent: CompositeSearch,
    ingest: IngestComposite
  },
  // Nodes only needed to create urls
  [SAMPLE_NODE]: {
    url: 'samples'
  },
  [TIMESERIE_NODE]: {
    url: 'timeseries'
  }
}

export function getNodeType(url, index) {
  const map = {
    0: {
      [NODES[PROJECT_NODE].url]: PROJECT_NODE
    },
    1: {
      [NODES[CYCLE_NODE].url]: CYCLE_NODE,
      [NODES[POSTMORTEM_NODE].url]: POSTMORTEM_NODE,
      [NODES[COMPOSITION_NODE].url]: COMPOSITION_NODE
    },
    2: {
      [NODES[BATCH_NODE].url]: BATCH_NODE,
      [NODES[TEST1_NODE].url]: TEST1_NODE,
      [NODES[SAMPLE_NODE].url]: SAMPLE_NODE
    },
    3: {
      [NODES[TEST0_NODE].url]: TEST0_NODE,
      [NODES[TIMESERIE_NODE].url]: TIMESERIE_NODE
    },
  }

  if (has(map, `${index}.${url}`)) {
    return map[index][url];
  }

  console.warn('No matching node for this url');
  return null;
}
