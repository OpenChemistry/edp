import { girderClient } from '@openchemistry/girder-redux';

// Folder
export function getFolder(parentId, parentType, name) {

  return girderClient().get('folder', {
    params: {
      parentId,
      parentType,
      name,
    }
  })
  .then(response => response.data )
}

export function createFolder(parentId, parentType, name, reuseExisting=true) {
  return girderClient().post('folder', {}, {
    params: {
      parentId,
      parentType,
      name,
      reuseExisting,
    }
  })
  .then(response => response.data )
}

// File

export function createFile(parentId, parentType, name, size, mimeType) {
  return girderClient().post('file', null, {
    params: {
      parentId,
      parentType,
      name,
      size,
      mimeType,
    }
  })
  .then(response => response.data );
}

export function updateFile(id, name, mimeType) {
  return girderClient().put(`file/${id}`, {},  {
    params: {
      name,
      mimeType
    }
  })
  .then(response => response.data )
}

export function updateFileContent(id, size) {

  return girderClient().put(`file/${id}/contents`, null,  {
    params: {
      size
    }
  })
  .then(response => response.data );
}

export function uploadFileChunk(uploadId, offset, data, config) {
  return girderClient().post('file/chunk', data,  {
    ...config,
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    params: {
      uploadId,
      offset,
    }
  })
  .then(response => response.data )
}
