import { call, put, takeEvery, select } from 'redux-saga/effects';

import {
  FETCH_SAMPLES_REQUESTED, FETCH_SAMPLES_SUCCEEDED, FETCH_SAMPLES_FAILED,
  FETCH_TIMESERIE_REQUESTED, FETCH_TIMESERIE_SUCCEEDED, FETCH_TIMESERIE_FAILED
} from '../ducks/composites';

import {
  getSamples as getSamplesRest, getSamplesStatic
} from '../../rest/composites';
import { getItems as getItemsRest } from '../../rest/items';

import { getServerSettings } from  '../ducks/settings'


function* onFetchSamples(action) {
  try {
    const { ancestors, item, platemapId, runId } = action.payload;
    const state = yield select();
    const settings = getServerSettings(state);

    let get = getSamplesRest
    // If we are a static deployment on S3 use static call that will
    // the urlencode the ? and =
    if (settings.static) {
      get = getSamplesStatic;
    }

    const samples = yield call(get, ancestors, item, platemapId, runId);
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
    const { ancestors, item, runId, fitted } = action.payload;
    const timeseries = yield call(getItemsRest, ancestors, item, {runId, fitted});
    yield put({type: FETCH_TIMESERIE_SUCCEEDED, payload: {timeseries, fitted}});
  } catch (e) {
    yield put({type: FETCH_TIMESERIE_FAILED, error: e});
  }
}

export function* fetchTimeserieSaga() {
  yield takeEvery(FETCH_TIMESERIE_REQUESTED, onFetchTimeserie);
}
