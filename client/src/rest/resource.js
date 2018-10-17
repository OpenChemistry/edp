import { girderClient } from '@openchemistry/girder-redux';

export function lookupResource(path) {
    return girderClient().get(`resource/lookup`, {
      params: {
        test: true,
        path
      }
    })
    .then(response => response.data);
}
