import girderClient from '@openchemistry/girder-client';
import { makeUrl } from '../nodes';

const prefix = 'edp';

export function getSamples(ancestors, item, platemapId, runId) {
  const url = makeUrl(ancestors, item, prefix);
  return girderClient().get(`${url}/samples`, {
    params: {
      platemapId,
      // runId,
      limit: Number.MAX_SAFE_INTEGER
    }
  })
  .then(response => response.data);
}

export function getTimeseries(ancestors, item) {
  const url = makeUrl(ancestors, item, prefix);
  return girderClient().get(`${url}/`)
}
