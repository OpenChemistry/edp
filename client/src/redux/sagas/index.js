import { fork } from 'redux-saga/effects';

import {
  watchAuthenticate,
  watchFetchMe,
  watchFetchOauthProviders,
  watchInvalidateToken,
  watchNewToken,
  watchUsernameLogin,
  watchTestOauthEnabled
} from './auth';

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
  fetchTestsSaga,
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
  yield fork(fetchTestsSaga);

  yield fork(watchAuthenticate);
  yield fork(watchFetchMe);
  yield fork(watchFetchOauthProviders);
  yield fork(watchTestOauthEnabled);
  yield fork(watchInvalidateToken);
  yield fork(watchNewToken);
  yield fork(watchUsernameLogin);
}
