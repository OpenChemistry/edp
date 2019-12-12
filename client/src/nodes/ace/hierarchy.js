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

import IngestComposite from '../../containers/ingest/composite';
import CompositeSearch from '../../containers/composite-search';

export const PROJECT_NODE = 'PROJECT_NODE';
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
    children: [COMPOSITION_NODE],
    parentId: null,
    primaryField: 'title',
    secondaryField: 'startDate',
    color: indigo[500],
    icon: Folder
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
      [NODES[COMPOSITION_NODE].url]: COMPOSITION_NODE
    },
    2: {
      [NODES[SAMPLE_NODE].url]: SAMPLE_NODE
    },
    3: {
      [NODES[TIMESERIE_NODE].url]: TIMESERIE_NODE
    },
  }

  if (has(map, `${index}.${url}`)) {
    return map[index][url];
  }

  console.warn('No matching node for this url');
  return null;
}

export function redirectItemView(nodeType) {
  return nodeType !== COMPOSITION_NODE;
}
