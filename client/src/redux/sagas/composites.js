import { call, put, takeEvery } from 'redux-saga/effects';

import {
  FETCH_SAMPLES_REQUESTED, FETCH_SAMPLES_SUCCEEDED, FETCH_SAMPLES_FAILED
} from '../ducks/composites';

import {
  getSamples as getSamplesRest
} from '../../rest/composites';


function* onFetchSamples(action) {
  try {
    const { ancestors, item, platemapId, runId } = action.payload;
    const samples = yield call(getSamplesRest, ancestors, item, platemapId, runId);
    yield put({type: FETCH_SAMPLES_SUCCEEDED, payload: {samples, platemapId, runId}});
  } catch (e) {
    yield put({type: FETCH_SAMPLES_FAILED, error: e});
  }
}

export function* fetchSamplesSaga() {
  yield takeEvery(FETCH_SAMPLES_REQUESTED, onFetchSamples);
}