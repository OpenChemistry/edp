import { call, put, takeEvery } from 'redux-saga/effects';

import {
  fetchDatabases, receiveDatabases
} from '../ducks/databases';

import {
  getDatabases
} from '../../rest/databases';

function* onFetchDatabases(action) {
  try {
    const databases = yield call(getDatabases);
    yield put(receiveDatabases(databases));
  } catch (e) {
    console.error(e)
  }
}

export function* fetchDatabasesSaga() {
  yield takeEvery(fetchDatabases.toString(), onFetchDatabases);
}
