import { isNil } from 'lodash-es';

import { ROOT_NODE } from './root';

import {
  NODES as sow8NODES,
  getNodeType as sow8getNodeType
} from './sow8/hierarchy';

import {
  createFieldsFactory as sow8createFieldsFactory
} from './sow8/fields';

import {
  NODES as sow10NODES,
  getNodeType as sow10getNodeType
} from './sow10/hierarchy';

import {
  createFieldsFactory as sow10createFieldsFactory
} from './sow10/fields';

import {
  NODES as sow11NODES,
  getNodeType as sow11getNodeType
} from './sow11/hierarchy';

import {
  createFieldsFactory as sow11createFieldsFactory
} from './sow11/fields';


export const SOW8 = 'sow8';
export const SOW10 = 'sow10';
export const SOW11 = 'sow11';

let DEPLOYMENT = null;

export function setDeployment(settings) {
  DEPLOYMENT = settings['deployment'];
}

export function getNodes() {
  const defaultVal = sow8NODES;
  switch (DEPLOYMENT) {
    case SOW8 : {
      return sow8NODES;
    } case SOW10 : {
      return sow10NODES;
    } case SOW11 : {
      return sow11NODES;
    } default : {
      return defaultVal;
    }
  }
}

export function makeUrl(ancestors, item, prefix = '') {
  let url = prefix;
  const NODES = getNodes();
  for (let ancestor of ancestors) {
    const { type, _id } = ancestor;
    if (!isNil(_id)) {
      url += `/${NODES[type].url}/${_id}`;
    }
  }
  const { type, _id } = item;
  if (type !== ROOT_NODE) {
    url += `/${NODES[type].url}`;
    if (!isNil(_id)) {
      url += `/${_id}`;
    }
  }
  return url;
}

export function parseUrl(url) {
  let regexStr = `((\\w+)\\/(\\w+)?)(\\/(\\w+)\\/(\\w+)?)?(\\/(\\w+)\\/(\\w+)?)?(\\/(\\w+)\\/(\\w+)?)?(\\/(\\w+)\\/(\\w+)?)?`;
  let regex = new RegExp(regexStr);
  let mo = url.match(regex);

  let ancestors = [];
  if (mo) {
    for (let i = 0; i < 4; ++i) {
      const idGroup = (i + 1) * 3;
      const urlGroup = idGroup - 1;
      let _id = null;
      let url = null;

      if (!isNil(mo[urlGroup])) {
        url = mo[urlGroup];
      }

      if (!isNil(mo[idGroup])) {
        _id = mo[idGroup];
      }

      if (isNil(url) && isNil(_id)) {
        break;
      }

      ancestors.push(
        {
          type: getNodeType(url, i),
          _id,
          url
        }
      )
    }
  }
  return ancestors;
}

export function parseUrlMatch(match) {
  const ancestors = [];
  // Up to 5 depth
  for (let i = 0; i < 5; ++i) {
    let url = match.params[`url${i}`];
    let _id = match.params[`id${i}`];

    if (!isNil(url)) {
      let type = getNodeType(url, i);
      ancestors.push({
        url,
        _id,
        type
      })
    }
  }
  return ancestors;
}

function getNodeType(url, i) {
  const defaultVal = sow8getNodeType;
  switch (DEPLOYMENT) {
    case SOW8 : {
      return sow8getNodeType(url, i);
    } case SOW10 : {
      return sow10getNodeType(url, i);
    } case SOW11 : {
      return sow11getNodeType(url, i);
    } default : {
      return defaultVal(url, i);
    }
  }
}

export function createFieldsFactory(nodeType) {
  const defaultVal = sow8createFieldsFactory;
  switch (DEPLOYMENT) {
    case SOW8 : {
      return sow8createFieldsFactory(nodeType);
    } case SOW10 : {
      return sow10createFieldsFactory(nodeType);
    } case SOW11 : {
      return sow11createFieldsFactory(nodeType);
    } default : {
      return defaultVal(nodeType);
    }
  }
}
