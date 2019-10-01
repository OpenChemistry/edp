import girderClient from '@openchemistry/girder-client';
import { makeUrl } from '../nodes';
import { isNil } from 'lodash-es';

const prefix = 'edp';

export function getSamples(ancestors, item, platemapId, runId, dataset) {
  const url = makeUrl(ancestors, item, prefix);
  const params = {
    platemapId,
    // runId,
    limit: Number.MAX_SAFE_INTEGER
  }
  if (!isNil(dataset)) {
    params.dataset = dataset;
  }
  return girderClient().get(`${url}/samples`, { params })
  .then(response => response.data);
}

export function getTimeseries(ancestors, item, dataset) {
  const url = makeUrl(ancestors, item, prefix);
  const params = {};
  if (!isNil(dataset)) {
    params.dataset = dataset;
  }
  return girderClient().get(`${url}/`, { params })
}
