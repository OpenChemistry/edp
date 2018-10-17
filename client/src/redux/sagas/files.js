import {
  call, put, take,
  select, takeEvery
} from 'redux-saga/effects';
import { buffers, eventChannel, END } from 'redux-saga';

import { isNil, isEmpty } from 'lodash-es';

import { auth } from '@openchemistry/girder-redux';

import { requestUpload, uploadProgress,
  receiveRootFolder, REQUEST_ROOT_FOLDER,
  uploadComplete
} from '../ducks/files';

import {
  getFolder,
  createFolder,
  createFile,
  updateFile,
  updateFileContent,
  uploadFileChunk
} from '../../rest/files';

import { lookupResource } from '../../rest/resource';

const chunkSize = 1024 * 1024 * 64; // 64MB

export function* fetchRootFolder() {
  const state = yield select();

  // First check for data folder in edp collection
  const edpDataFolder = yield call(lookupResource, '/collection/edp/data');

  if (!isNil(edpDataFolder)) {
    yield put( receiveRootFolder(edpDataFolder))

    return edpDataFolder
  }

  const me = auth.selectors.getMe(state);

  let privateFolder = yield call(getFolder, me['_id'], 'user', 'Private');
  if (isEmpty(privateFolder)) {
    throw new Error('User doesn\'t have a Private folder.');
  }
  else {
    privateFolder = privateFolder[0];
  }

  const rootFolder = yield call(createFolder,
    privateFolder['_id'], 'folder', 'edp', true);

  yield put( receiveRootFolder(rootFolder))

  return rootFolder
}

export function* watchRequestRootFolder() {
  yield takeEvery(REQUEST_ROOT_FOLDER, fetchRootFolder);
}

export function* uploadFile(file, folderId, id=null) {
  let uploadModel = null;
  if (isNil(id)) {
    uploadModel = yield call(createFile, folderId, 'folder',
      file.name, file.size, file.type);
  } else {
    uploadModel = yield call(updateFile, id, file.name, file.type);
    uploadModel = yield call(updateFileContent, id, file.size);
  }

  yield put( requestUpload(uploadModel['_id'], file));
  const fileModel = yield call(uploadFileContent, uploadModel['_id'], file);
  yield put( uploadComplete(uploadModel['_id']) );

  return fileModel;
}

function createUploadFileChunkChannel(id, offset, data) {
  return eventChannel(emitter => {

    const config = {
      onUploadProgress: (progressEvent) => {
        emitter({progressEvent});
      }
    }
    uploadFileChunk(id, offset, data, config)
      .then(function (res) {
        const file = res;
        emitter({ complete: file });
        emitter(END);
      })
      .catch(function (error) {
        emitter({ error });
        emitter(END);
      });
    return () => {};
  }, buffers.sliding(2));
}

function* uploadFileContent(uploadId, file) {
  let offset = 0;
  const sliceFn = file.webkitSlice ? 'webkitSlice' : 'slice';
  // The file model is return when the last chunk is uploaded
  let fileModel = null;

  while (offset < file.size) {
    const end = Math.min(offset + chunkSize, file.size);
    const chunk = file[sliceFn](offset, end);

    const channel = yield call(createUploadFileChunkChannel, uploadId, offset, chunk);
    while (true) {
      const { progressEvent, complete, error } = yield take(channel);
      if (error) { // TODO file id?
        console.log(error);
        yield put(requestUpload(uploadId, error));
        return;
      } else if (complete) {
        fileModel = complete;
        break;
      } else if (progressEvent) {
        yield put(uploadProgress(uploadId, offset, progressEvent));
      }
    }
    offset += chunkSize;
  }

  return fileModel;
}
