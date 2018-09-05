import { girderClient } from '@openchemistry/girder-redux';

export function getExperimentTests(experimentId) {
  return girderClient().get(`edp/experiments/${experimentId}/tests`)
    .then(response => response.data );
}

export function getTest(experimentId, testId) {
  return girderClient().get(`edp/experiments/${experimentId}/tests/${testId}`)
    .then(response => response.data );
}

export function createTest(test) {
  return girderClient().post(`edp/experiments/${test.experimentId}/tests`, test)
    .then(response => response.data );
}

export function updateTest(test) {
  return girderClient().patch(`edp/experiments/${test.experimentId}/tests/${test._id}`, test)
    .then(response => response.data );
}

export function deleteTest(test) {
  return girderClient().delete(`edp/experiments/${test.experimentId}/tests/${test._id}`)
    .then(response => response.data );
}
