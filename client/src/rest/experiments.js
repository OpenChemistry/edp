import { girderClient } from '@openchemistry/girder-redux';

export function getExperiments() {
  return girderClient().get('edp/experiments/')
    .then(response => response.data );
}

export function getExperiment(experimentId) {
  return girderClient().get(`edp/experiments/${experimentId}`)
    .then(response => response.data );
}

export function createExperiment(experiment) {
  return girderClient().post('edp/experiments/', experiment)
    .then(response => response.data );
}

export function updateExperiment(experiment) {
  return girderClient().patch(`edp/experiments/${experiment._id}`, experiment)
    .then(response => response.data );
}

export function deleteExperiment(experimentId) {
  return girderClient().delete(`edp/experiments/${experiment}`)
    .then(response => response.data );
}
