import { fork } from 'redux-saga/effects';

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
}
