import { call, put, takeEvery } from 'redux-saga/effects';

import {
  FETCH_SAMPLES_REQUESTED, FETCH_SAMPLES_SUCCEEDED, FETCH_SAMPLES_FAILED,
  FETCH_TIMESERIE_REQUESTED, FETCH_TIMESERIE_SUCCEEDED, FETCH_TIMESERIE_FAILED
} from '../ducks/composites';

import {
  getSamples as getSamplesRest
} from '../../rest/composites';
import { getItems as getItemsRest } from '../../rest/items';


function* onFetchSamples(action) {
  try {
    const { dataset, ancestors, item, platemapId, runId } = action.payload;
    const samples = yield call(getSamplesRest, ancestors, item, platemapId, runId, dataset);
    yield put({type: FETCH_SAMPLES_SUCCEEDED, payload: {samples, platemapId, runId}});
  } catch (e) {
    yield put({type: FETCH_SAMPLES_FAILED, error: e});
  }
}

export function* fetchSamplesSaga() {
  yield takeEvery(FETCH_SAMPLES_REQUESTED, onFetchSamples);
}

function* onFetchTimeserie(action) {
  try {
    const { ancestors, item, runId, fitted, dataset } = action.payload;
    const timeseries = yield call(getItemsRest, ancestors, item, {runId, fitted, dataset});
    yield put({type: FETCH_TIMESERIE_SUCCEEDED, payload: {timeseries, fitted}});
  } catch (e) {
    yield put({type: FETCH_TIMESERIE_FAILED, error: e});
  }
}

export function* fetchTimeserieSaga() {
  yield takeEvery(FETCH_TIMESERIE_REQUESTED, onFetchTimeserie);
}
