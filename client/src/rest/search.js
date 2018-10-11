import { girderClient } from '@openchemistry/girder-redux';

const prefix = 'edp';

export function globalSearch(fields) {
    return girderClient().get(`${prefix}/search`, {
      params: {
        ...fields
      }
    })
    .then(response => response.data);
}
