import { call, put, takeLatest } from 'redux-saga/effects';

import {
  FETCH_INGEST_KEY_REQUESTED, FETCH_INGEST_KEY_SUCCEEDED, FETCH_INGEST_KEY_FAILED
} from '../ducks/apiKeys';

import {
  getApiKeys as getApiKeysRest,
  createApiKey as createApiKeyRest
} from '../../rest/apiKeys';

function* onFetchIngestKey(action) {
  try {
    let apiKeys = yield call(getApiKeysRest);
    apiKeys = apiKeys.filter(val => val.name === 'edp_ingest');
    let ingestKey;
    if (apiKeys.length > 0) {
      ingestKey = apiKeys[0];
    } else {
      ingestKey = yield call(createApiKeyRest, 'edp_ingest');
    }
    yield put({type: FETCH_INGEST_KEY_SUCCEEDED, payload: ingestKey.key});
  } catch (e) {
    yield put({type: FETCH_INGEST_KEY_FAILED, error: e});
  }
}

export function* fetchIngestKeySaga() {
  yield takeLatest(FETCH_INGEST_KEY_REQUESTED, onFetchIngestKey);
}


