import { isNil } from 'lodash-es';
import girderClient from '@openchemistry/girder-client';

export function get(id) {
  let url = 'job';
  if (!isNil(id)) {
    url = `job/${id}`;
  }

  return girderClient(url).get()
  .then(response => response.data )
}
