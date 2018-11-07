import { girderClient } from '@openchemistry/girder-redux';
import { makeUrl } from '../utils/nodes';

const prefix = 'edp';

export function globalSearch(fields) {
  return girderClient().get(`${prefix}/search`, {
    params: {
      ...fields
    }
  })
  .then(response => response.data);
}

export function localSearch(ancestors, item, fields) {
  const url = makeUrl(ancestors, item, prefix);
  return girderClient().get(`${url}/search`, {
    params: {
      ...fields
    }
  })
  .then(response => response.data);
}
