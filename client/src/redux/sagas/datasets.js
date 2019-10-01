import { call, put, takeEvery } from 'redux-saga/effects';

import {
  fetchDatasets, receiveDatasets
} from '../ducks/datasets';

import {
  getDatasets
} from '../../rest/datasets';

function* onFetchDatasets(action) {
  try {
    const datasets = yield call(getDatasets);
    yield put(receiveDatasets(datasets));
  } catch (e) {
    console.error(e)
  }
}

export function* fetchDatasetsSaga() {
  yield takeEvery(fetchDatasets.toString(), onFetchDatasets);
}
