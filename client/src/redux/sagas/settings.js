import { call, put, takeEvery } from 'redux-saga/effects';

import {
  fetchServerSettings, receiveServerSettings
} from '../ducks/settings';

import {
  getServerSettings as getServerSettingsRest
} from '../../rest/settings';

import { setDeployment } from '../../nodes';

function* onFetchServerSettings(action) {
  try {
    const settings = yield call(getServerSettingsRest);
    setDeployment(settings);
    yield put(receiveServerSettings(settings));
  } catch (e) {
    // yield put(fetchServerSettings(e));
  }
}

export function* fetchServerSettingsSaga() {
  yield takeEvery(fetchServerSettings.toString(), onFetchServerSettings);
}
