import { fork } from 'redux-saga/effects';

import { auth } from '@openchemistry/girder-redux';

import {
  createItemSaga,
  fetchItemSaga,
  updateItemSaga,
  deleteItemSaga,
  fetchItemsSaga
} from './items';

import {
  globalSearchSaga,
  compositeSearchSaga
} from './search';

import {
  fetchIngestKeySaga
} from './apiKeys';

import {
  fetchSamplesSaga,
  fetchTimeserieSaga
} from './composites';

import {
  fetchServerSettingsSaga
} from './settings';

export default function* root() {
  yield fork(createItemSaga);
  yield fork(fetchItemSaga);
  yield fork(updateItemSaga);
  yield fork(deleteItemSaga);
  yield fork(fetchItemsSaga);

  yield fork(globalSearchSaga);
  yield fork(compositeSearchSaga);

  yield fork(fetchIngestKeySaga);

  yield fork(fetchSamplesSaga);
  yield fork(fetchTimeserieSaga);

  yield fork(fetchServerSettingsSaga);

  yield fork(auth.sagas.watchAuthenticate);
  yield fork(auth.sagas.watchFetchMe);
  yield fork(auth.sagas.watchFetchOauthProviders);
  yield fork(auth.sagas.watchTestOauthEnabled);
  yield fork(auth.sagas.watchInvalidateToken);
  yield fork(auth.sagas.watchNewToken);
  yield fork(auth.sagas.watchUsernameLogin);
}
