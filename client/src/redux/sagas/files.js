import { call, put, takeEvery } from 'redux-saga/effects';

import {
  fetchFile, receiveFile
} from '../ducks/files';

import {
  getFile as getFileRest
} from '../../rest/files';

function* onFetchFile(action) {
  try {
    const id = action.payload;
    const file = yield call(getFileRest, id);
    yield put(receiveFile(file));
  } catch (e) {
    // yield put(fetchFile({error: e}));
  }
}

export function* fetchFileSaga() {
  yield takeEvery(fetchFile.toString(), onFetchFile);
}
