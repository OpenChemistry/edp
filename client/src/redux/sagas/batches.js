import {
  CREATE_BATCH_REQUESTED, CREATE_BATCH_SUCCEEDED, CREATE_BATCH_FAILED,
  FETCH_BATCH_REQUESTED, FETCH_BATCH_SUCCEEDED, FETCH_BATCH_FAILED,
  UPDATE_BATCH_REQUESTED, UPDATE_BATCH_SUCCEEDED, UPDATE_BATCH_FAILED,
  DELETE_BATCH_REQUESTED, DELETE_BATCH_SUCCEEDED, DELETE_BATCH_FAILED,
  FETCH_BATCHES_REQUESTED, FETCH_BATCHES_SUCCEEDED, FETCH_BATCHES_FAILED,
} from '../ducks/batches';

import {
  getBatches as getBatchesRest,
  getBatch as getBatchRest,
  createBatch as createBatchRest,
  updateBatch as updateBatchRest,
  deleteBatch as deleteBatchRest
} from '../../rest/batches';

import { call, put, takeEvery } from 'redux-saga/effects';

// Create batch

function* onCreateBatch(action) {
  const { batch, experimentId, resolve, reject } = action.payload;
  try {
    const newBatch = yield call(createBatchRest, experimentId, batch);
    yield put({type: CREATE_BATCH_SUCCEEDED, payload: {batch: newBatch}});
    resolve(newBatch);
  } catch (e) {
    yield put({type: CREATE_BATCH_FAILED, error: e});
    reject(e);
  }
}

export function* createBatchSaga() {
  yield takeEvery(CREATE_BATCH_REQUESTED, onCreateBatch);
}

// Fetch batch

function* onFetchBatch(action) {
  try {
    const { experimentId, batchId } = action.payload;
    const batch = yield call(getBatchRest, experimentId, batchId);
    yield put({type: FETCH_BATCH_SUCCEEDED, payload: { batch }});
  } catch (e) {
    yield put({type: FETCH_BATCH_FAILED, error: e});
  }
}

export function* fetchBatchSaga() {
  yield takeEvery(FETCH_BATCH_REQUESTED, onFetchBatch);
}

// Update batch

function* onUpdateBatch(action) {
  const { experimentId, batch, resolve, reject } = action.payload;
  try {
    const newBatch = yield call(updateBatchRest, experimentId, batch);
    yield put({type: UPDATE_BATCH_SUCCEEDED, payload: { batch: newBatch }});
    resolve(newBatch);
  } catch (e) {
    yield put({type: UPDATE_BATCH_FAILED, error: e});
    reject(e);
  }
}

export function* updateBatchSaga() {
  yield takeEvery(UPDATE_BATCH_REQUESTED, onUpdateBatch);
}

// Delete batch

function* onDeleteBatch(action) {
  try {
    const { experimentId, batchId } = action.payload;
    yield call(deleteBatchRest, experimentId, batchId);
    yield put({type: DELETE_BATCH_SUCCEEDED, payload: {id: batchId}});
  } catch (e) {
    yield put({type: DELETE_BATCH_FAILED, error: e});
  }
}

export function* deleteBatchtSaga() {
  yield takeEvery(DELETE_BATCH_REQUESTED, onDeleteBatch);
}


// Fetch all experiment's batches

function* onFetchBatches(action) {
  try {
    const { experimentId } = action.payload;
    const batches = yield call(getBatchesRest, experimentId);
    yield put({type: FETCH_BATCHES_SUCCEEDED, payload: {batches}});
  } catch (e) {
    yield put({type: FETCH_BATCHES_FAILED, error: e});
  }
}

export function* fetchBatchesSaga() {
  yield takeEvery(FETCH_BATCHES_REQUESTED, onFetchBatches);
}
