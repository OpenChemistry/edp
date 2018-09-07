import { call, put, takeEvery, select, all } from 'redux-saga/effects';
import { isNil } from 'lodash-es';

import {
  CREATE_TEST_REQUESTED, CREATE_TEST_SUCCEEDED, CREATE_TEST_FAILED,
  FETCH_TEST_REQUESTED, FETCH_TEST_SUCCEEDED, FETCH_TEST_FAILED,
  UPDATE_TEST_REQUESTED, UPDATE_TEST_SUCCEEDED, UPDATE_TEST_FAILED,
  DELETE_TEST_REQUESTED, DELETE_TEST_SUCCEEDED, DELETE_TEST_FAILED,
  FETCH_TESTS_REQUESTED, FETCH_TESTS_SUCCEEDED, FETCH_TESTS_FAILED,
} from '../ducks/tests';

import {
  getTests as getTestsRest,
  getTest as getTestRest,
  createTest as createTestRest,
  updateTest as updateTestRest,
  deleteTest as deleteTestRest,
} from '../../rest/tests';

import {
  getRootFolder,
} from '../ducks/files';

import {
  fetchRootFolder,
  uploadFile
} from '../sagas/files';

function* uploadTestFiles(test) {
  let rootFolder = yield select(getRootFolder);
  if (isNil(rootFolder)) {
    rootFolder = yield call(fetchRootFolder);
  }

  const filesToUpload = {};

  if (!isNil(test.metaDataFile)) {
    filesToUpload['metaDataFileModel'] = call(uploadFile, test.metaDataFile, rootFolder['_id'], test.metaDataFileId);
  }
  
  if (!isNil(test.dataFile)) {
    filesToUpload['dataFileModel'] = call(uploadFile, test.dataFile, rootFolder['_id'], test.dataFileId);
  }

  const {
    metaDataFileModel,
    dataFileModel
  } = yield all(filesToUpload);

  delete test.metaDataFile;
  if (!isNil(metaDataFileModel)) {
    test['metaDataFileId'] = metaDataFileModel['_id'];
  }

  delete test.dataFile;
  if (!isNil(dataFileModel)) {
    test['dataFileId'] = dataFileModel['_id'];
  }
  // return test;
}

// Create test

function* onCreateTest(action) {
  const {experimentId, batchId, test, resolve, reject} = action.payload;
  try {
    yield uploadTestFiles(test);
    const newTest = yield call(createTestRest, experimentId, batchId, test);
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
    const { experimentId, batchId, testId } = action.payload;
    const test = yield call(getTestRest, experimentId, batchId, testId);
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
  const {experimentId, batchId, test, resolve, reject} = action.payload;
  try {
    yield uploadTestFiles(test);
    const newTest = yield call(updateTestRest, experimentId, batchId, test);
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
    const {experimentId, batchId, testId} = action.payload;
    yield call(deleteTestRest, experimentId, batchId, testId);
    yield put({type: DELETE_TEST_SUCCEEDED, payload: {id: testId}});
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
    const {experimentId, batchId} = action.payload;
    const tests = yield call(getTestsRest, experimentId, batchId);
    yield put({type: FETCH_TESTS_SUCCEEDED, payload: {tests}});
  } catch (e) {
    yield put({type: FETCH_TESTS_FAILED, error: e});
  }
}

export function* fetchTestsSaga() {
  yield takeEvery(FETCH_TESTS_REQUESTED, onFetchTests);
}
