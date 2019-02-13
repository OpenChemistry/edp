import girderClient from '@openchemistry/girder-client';

export function getServerSettings() {
  return girderClient().get('edp/configuration')
    .then(response => response.data );
}
