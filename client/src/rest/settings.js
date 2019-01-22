import { girderClient } from '@openchemistry/girder-redux';

export function getServerSettings() {
  return girderClient().get('edp/configuration')
    .then(response => response.data );
}
