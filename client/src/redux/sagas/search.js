import { call, put, takeEvery } from 'redux-saga/effects';

import { isFunction } from 'lodash-es';

import {
  GLOBAL_SEARCH_REQUESTED, GLOBAL_SEARCH_SUCCEEDED, GLOBAL_SEARCH_FAILED
} from '../ducks/search';

import { globalSearch as globalSearchRest } from '../../rest/search';

// Search by fields

function* onGlobalSearch(action) {
  const {fields, resolve, reject} = action.payload;
  try {
    const matches = yield call(globalSearchRest, fields);
    yield put({type: GLOBAL_SEARCH_SUCCEEDED, payload: matches});
    if (isFunction(resolve)) {
      resolve();
    }
  } catch (e) {
    yield put({type: GLOBAL_SEARCH_FAILED, error: e});
    if (isFunction(reject)) {
      reject(e);
    }
  }
}

export function* globalSearchSaga() {
  yield takeEvery(GLOBAL_SEARCH_REQUESTED, onGlobalSearch);
}
