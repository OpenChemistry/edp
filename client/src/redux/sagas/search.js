import { call, put, takeEvery } from 'redux-saga/effects';

import { isFunction } from 'lodash-es';

import {
  GLOBAL_SEARCH_REQUESTED, GLOBAL_SEARCH_SUCCEEDED, GLOBAL_SEARCH_FAILED,
  COMPOSITE_SEARCH_REQUESTED, COMPOSITE_SEARCH_SUCCEEDED, COMPOSITE_SEARCH_FAILED
} from '../ducks/search';

import {
  globalSearch as globalSearchRest,
  localSearch as localSearchRest
} from '../../rest/search';

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

function* onCompositeSearch(action) {
  const { ancestors, item, fields, resolve, reject } = action.payload;
  try {
    const matches = yield call(localSearchRest, ancestors, item, fields);
    yield put({type: COMPOSITE_SEARCH_SUCCEEDED, payload: matches});
    if (isFunction(resolve)) {
      resolve();
    }
  } catch (e) {
    yield put({type: COMPOSITE_SEARCH_FAILED, error: e});
    if (isFunction(reject)) {
      reject(e);
    }
  }
}

export function* compositeSearchSaga() {
  yield takeEvery(COMPOSITE_SEARCH_REQUESTED, onCompositeSearch);
}
