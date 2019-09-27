import girderClient from '@openchemistry/girder-client';

export function getDatabases() {
  return  girderClient().get('databases')
    .then(response => response.data );
}
