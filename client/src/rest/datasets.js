import girderClient from '@openchemistry/girder-client';

export function getDatasets() {
  return  girderClient().get('datasets')
    .then(response => response.data );
}
