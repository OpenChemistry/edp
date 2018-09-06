import { girderClient } from '@openchemistry/girder-redux';

export function getBatches(experimentId) {
  return girderClient().get(`edp/experiments/${experimentId}/batches`)
    .then(response => response.data );
}

export function getBatch(experimentId, batchId) {
  return girderClient().get(`edp/experiments/${experimentId}/batches/${batchId}`)
    .then(response => response.data );
}

export function createBatch(experimentId, batch) {
  return girderClient().post(`edp/experiments/${experimentId}/batches`, batch)
    .then(response => response.data );
}

export function updateBatch(experimentId, batch) {
  return girderClient().patch(`edp/experiments/${experimentId}/batches/${batch._id}`, batch)
    .then(response => response.data );
}

export function deleteBatch(experimentId, batchId) {
  return girderClient().delete(`edp/experiments/${experimentId}/batches/${batchId}`)
    .then(response => response.data );
}
