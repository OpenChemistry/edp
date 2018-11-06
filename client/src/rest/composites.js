import { girderClient } from '@openchemistry/girder-redux';
import { makeUrl } from '../utils/nodes';

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
