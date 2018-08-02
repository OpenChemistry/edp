import {
  CREATE_TEST_REQUESTED, CREATE_TEST_SUCCEEDED, CREATE_TEST_FAILED,
  FETCH_TEST_REQUESTED, FETCH_TEST_SUCCEEDED, FETCH_TEST_FAILED,
  UPDATE_TEST_REQUESTED, UPDATE_TEST_SUCCEEDED, UPDATE_TEST_FAILED,
  DELETE_TEST_REQUESTED, DELETE_TEST_SUCCEEDED, DELETE_TEST_FAILED,
  FETCH_TESTS_REQUESTED, FETCH_TESTS_SUCCEEDED, FETCH_TESTS_FAILED,
} from '../ducks/tests';
import {
  createTest as createTestRest,
  getTest as getTestRest,
  updateTest as updateTestRest,
  deleteTest as deleteTestRest,
  getTests as getTestsRest,
} from '../../server';

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

// Fetch test

function* onFetchTest(action) {
  try {
    const test = yield call(getTestRest, action.payload.id);
    yield put({type: FETCH_TEST_SUCCEEDED, payload: {test}});
  } catch (e) {
    yield put({type: FETCH_TEST_FAILED, error: e});
  }
}

export function* fetchTestSaga() {
  yield takeEvery(FETCH_TEST_REQUESTED, onFetchTest);
}

// Update test

export function* createTestSaga() {
  yield takeEvery(CREATE_TEST_REQUESTED, onCreateTest);
}

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
    const id = yield call(deleteTestRest, action.payload.id);
    yield put({type: DELETE_TEST_SUCCEEDED, payload: {id}});
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

function* onFetchTests(action) {
  try {
    const tests = yield call(getTestsRest);
    yield put({type: FETCH_TESTS_SUCCEEDED, payload: {tests}});
  } catch (e) {
    yield put({type: FETCH_TESTS_FAILED, error: e});
  }
}

export function* fetchTestsSaga() {
  yield takeLatest(FETCH_TESTS_REQUESTED, onFetchTests);
}
