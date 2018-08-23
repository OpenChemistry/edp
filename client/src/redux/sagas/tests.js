import {
  CREATE_TEST_REQUESTED, CREATE_TEST_SUCCEEDED, CREATE_TEST_FAILED,
  FETCH_TEST_REQUESTED, FETCH_TEST_SUCCEEDED, FETCH_TEST_FAILED,
  UPDATE_TEST_REQUESTED, UPDATE_TEST_SUCCEEDED, UPDATE_TEST_FAILED,
  DELETE_TEST_REQUESTED, DELETE_TEST_SUCCEEDED, DELETE_TEST_FAILED,
  FETCH_EXPERIMENT_TESTS_REQUESTED, FETCH_EXPERIMENT_TESTS_SUCCEEDED, FETCH_EXPERIMENT_TESTS_FAILED,
} from '../ducks/tests';

// import {
//   createTest as createTestRest,
//   getTest as getTestRest,
//   updateTest as updateTestRest,
//   deleteTest as deleteTestRest,
// } from '../../mock-server';

import {
  getExperimentTests as getExperimentTestsRest,
  getTest as getTestRest,
  createTest as createTestRest,
  updateTest as updateTestRest,
  deleteTest as deleteTestRest,
} from '../../rest/tests';

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

// Create test

function* onCreateTest(action) {
  const {test, resolve, reject} = action.payload;
  try {
    const newTest = yield call(createTestRest, test);
    yield put({type: CREATE_TEST_SUCCEEDED, payload: {test: newTest}});
    resolve(newTest);
  } catch (e) {
    yield put({type: CREATE_TEST_FAILED, error: e});
    reject(e);
  }
}

export function* createTestSaga() {
  yield takeEvery(CREATE_TEST_REQUESTED, onCreateTest);
}

// Fetch test

function* onFetchTest(action) {
  try {
    const { experimentId, testId } = action.payload;
    const test = yield call(getTestRest, experimentId, testId);
    yield put({type: FETCH_TEST_SUCCEEDED, payload: {test}});
  } catch (e) {
    yield put({type: FETCH_TEST_FAILED, error: e});
  }
}

export function* fetchTestSaga() {
  yield takeEvery(FETCH_TEST_REQUESTED, onFetchTest);
}

// Update test

function* onUpdateTest(action) {
  const {test, resolve, reject} = action.payload;
  try {
    const newTest = yield call(updateTestRest, test);
    yield put({type: UPDATE_TEST_SUCCEEDED, payload: {test: newTest}});
    resolve(newTest);
  } catch (e) {
    yield put({type: UPDATE_TEST_FAILED, error: e});
    reject(e);
  }
}

// Delete test

function* onDeleteTest(action) {
  try {
    const {test} = action.payload;
    yield call(deleteTestRest, test);
    yield put({type: DELETE_TEST_SUCCEEDED, payload: {id: test._id}});
  } catch (e) {
    yield put({type: DELETE_TEST_FAILED, error: e});
  }
}

export function* deleteTestSaga() {
  yield takeEvery(DELETE_TEST_REQUESTED, onDeleteTest);
}

export function* updateTestSaga() {
  yield takeEvery(UPDATE_TEST_REQUESTED, onUpdateTest);
}

function* onFetchExperimentTests(action) {
  try {
    const experimentId = action.payload;
    const tests = yield call(getExperimentTestsRest, experimentId);
    yield put({type: FETCH_EXPERIMENT_TESTS_SUCCEEDED, payload: {tests}});
  } catch (e) {
    yield put({type: FETCH_EXPERIMENT_TESTS_FAILED, error: e});
  }
}

export function* fetchExperimentTestsSaga() {
  yield takeLatest(FETCH_EXPERIMENT_TESTS_REQUESTED, onFetchExperimentTests);
}
