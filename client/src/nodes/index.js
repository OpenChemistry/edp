import { isNil } from 'lodash-es';

import { ROOT_NODE } from './root';

import {
  NODES as sow8NODES,
  getNodeType as sow8getNodeType
} from './sow8/hierarchy';

import {
  createFieldsFactory as sow8createFieldsFactory
} from './sow8/fields';

const SOW8 = 'sow8';

export function getNodes() {
  const defaultVal = sow8NODES;
  switch (process.env.REACT_APP_NODES_HIERARCHY) {
    case SOW8 : {
      return sow8NODES;
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
  switch (process.env.REACT_APP_NODES_HIERARCHY) {
    case SOW8 : {
      return sow8getNodeType(url, i);
    } default : {
      return defaultVal(url, i);
    }
  }
}

export function createFieldsFactory(nodeType) {
  const defaultVal = sow8createFieldsFactory;
  switch (process.env.REACT_APP_NODES_HIERARCHY) {
    case SOW8 : {
      return sow8createFieldsFactory(nodeType);
    } default : {
      return defaultVal(nodeType);
    }
  }
}
