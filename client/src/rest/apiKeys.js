import { girderClient } from '@openchemistry/girder-redux';

export function getApiKeys() {
  return girderClient().get('api_key')
    .then(response => response.data );
}

export function createApiKey(name) {
  return girderClient().post('api_key', null, {params: {name}})
    .then(response => response.data );
}
