import { has } from 'lodash-es';

import { ROOT_NODE } from '../root';

import {
  Layers,
  Folder,
  ChangeHistory
} from '@material-ui/icons';

import {
  lightBlue,
  deepOrange,
  indigo
} from '@material-ui/core/colors';

export const PROJECT_NODE = 'PROJECT_NODE';

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
    children: [],
    parentId: null,
    primaryField: 'title',
    color: indigo[500],
    icon: Folder,
    fileFields: ['dataFile']
  }
}

export function getNodeType(url, index) {
  const map = {
    0: {
      [NODES[PROJECT_NODE].url]: PROJECT_NODE
    }
  }

  if (has(map, `${index}.${url}`)) {
    return map[index][url];
  }

  console.warn('No matching node for this url');
  return null;
}
