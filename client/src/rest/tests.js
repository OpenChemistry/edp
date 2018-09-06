import { girderClient } from '@openchemistry/girder-redux';

export function getTests(experimentId, batchId) {
  return girderClient().get(`edp/experiments/${experimentId}/batches/${batchId}/tests`)
    .then(response => response.data );
}

export function getTest(experimentId, batchId, testId) {
  return girderClient().get(`edp/experiments/${experimentId}/batches/${batchId}/tests/${testId}`)
    .then(response => response.data );
}

export function createTest(experimentId, batchId, test) {
  return girderClient().post(`edp/experiments/${experimentId}/batches/${batchId}/tests`, test)
    .then(response => response.data );
}

export function updateTest(experimentId, batchId, test) {
  return girderClient().patch(`edp/experiments/${experimentId}/batches/${batchId}/tests/${test._id}`, test)
    .then(response => response.data );
}

export function deleteTest(experimentId, batchId, testId) {
  return girderClient().delete(`edp/experiments/${experimentId}/batches/${batchId}/tests/${testId}`)
    .then(response => response.data );
}
