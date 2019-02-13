import girderClient from '@openchemistry/girder-client';
import { makeUrl } from '../nodes';

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
