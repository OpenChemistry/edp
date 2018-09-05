import { fork } from 'redux-saga/effects';

import { auth } from '@openchemistry/girder-redux';

import {
  createExperimentSaga,
  fetchExperimentSaga,
  updateExperimentSaga,
  deleteExperimentSaga,
  fetchExperimentsSaga,
} from './experiments';

import {
  createTestSaga,
  fetchTestSaga,
  updateTestSaga,
  deleteTestSaga,
  fetchExperimentTestsSaga,
} from './tests';

export default function* root() {
  yield fork(createExperimentSaga);
  yield fork(fetchExperimentSaga);
  yield fork(updateExperimentSaga);
  yield fork(deleteExperimentSaga);
  yield fork(fetchExperimentsSaga);
  yield fork(createTestSaga);
  yield fork(fetchTestSaga);
  yield fork(updateTestSaga);
  yield fork(deleteTestSaga);
  yield fork(fetchExperimentTestsSaga);

  yield fork(auth.sagas.watchAuthenticate);
  yield fork(auth.sagas.watchFetchMe);
  yield fork(auth.sagas.watchFetchOauthProviders);
  yield fork(auth.sagas.watchTestOauthEnabled);
  yield fork(auth.sagas.watchInvalidateToken);
  yield fork(auth.sagas.watchNewToken);
  yield fork(auth.sagas.watchUsernameLogin);
}
