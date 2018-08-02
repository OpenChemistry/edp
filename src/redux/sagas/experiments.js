import {
  CREATE_EXPERIMENT_REQUESTED, CREATE_EXPERIMENT_SUCCEEDED, CREATE_EXPERIMENT_FAILED,
  FETCH_EXPERIMENT_REQUESTED, FETCH_EXPERIMENT_SUCCEEDED, FETCH_EXPERIMENT_FAILED,
  UPDATE_EXPERIMENT_REQUESTED, UPDATE_EXPERIMENT_SUCCEEDED, UPDATE_EXPERIMENT_FAILED,
  DELETE_EXPERIMENT_REQUESTED, DELETE_EXPERIMENT_SUCCEEDED, DELETE_EXPERIMENT_FAILED,
  FETCH_EXPERIMENTS_REQUESTED, FETCH_EXPERIMENTS_SUCCEEDED, FETCH_EXPERIMENTS_FAILED,
} from '../ducks/experiments';
import {
  createExperiment as createExperimentRest,
  updateExperiment as updateExperimentRest,
  deleteExperiment as deleteExperimentRest,
  getExperiment as getExperimentRest,
  getExperiments as getExperimentsRest
} from '../../server';

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

// Create experiment

function* onCreateExperiment(action) {
  const {experiment, resolve, reject} = action.payload;
  try {
    const newExperiment = yield call(createExperimentRest, experiment);
    yield put({type: CREATE_EXPERIMENT_SUCCEEDED, payload: {experiment: newExperiment}});
    resolve(newExperiment);
  } catch (e) {
    yield put({type: CREATE_EXPERIMENT_FAILED, error: e});
    reject(e);
  }
}

export function* createExperimentSaga() {
  yield takeEvery(CREATE_EXPERIMENT_REQUESTED, onCreateExperiment);
}

// Fetch experiment

function* onFetchExperiment(action) {
  try {
    const experiment = yield call(getExperimentRest, action.payload.id);
    yield put({type: FETCH_EXPERIMENT_SUCCEEDED, payload: {experiment}});
  } catch (e) {
    yield put({type: FETCH_EXPERIMENT_FAILED, error: e});
  }
}

export function* fetchExperimentSaga() {
  yield takeEvery(FETCH_EXPERIMENT_REQUESTED, onFetchExperiment);
}

// Update experiment

function* onUpdateExperiment(action) {
  const {experiment, resolve, reject} = action.payload;
  try {
    const newExperiment = yield call(updateExperimentRest, experiment);
    yield put({type: UPDATE_EXPERIMENT_SUCCEEDED, payload: {experiment: newExperiment}});
    resolve(newExperiment);
  } catch (e) {
    yield put({type: UPDATE_EXPERIMENT_FAILED, error: e});
    reject(e);
  }
}

export function* updateExperimentSaga() {
  yield takeEvery(UPDATE_EXPERIMENT_REQUESTED, onUpdateExperiment);
}

// Delete experiment

function* onDeleteExperiment(action) {
  try {
    const id = yield call(deleteExperimentRest, action.payload.id);
    yield put({type: DELETE_EXPERIMENT_SUCCEEDED, payload: {id}});
  } catch (e) {
    yield put({type: DELETE_EXPERIMENT_FAILED, error: e});
  }
}

export function* deleteExperimentSaga() {
  yield takeEvery(DELETE_EXPERIMENT_REQUESTED, onDeleteExperiment);
}


// Fetch all experiments

function* onFetchExperiments(action) {
  try {
    const experiments = yield call(getExperimentsRest);
    yield put({type: FETCH_EXPERIMENTS_SUCCEEDED, payload: {experiments}});
  } catch (e) {
    yield put({type: FETCH_EXPERIMENTS_FAILED, error: e});
  }
}

export function* fetchExperimentsSaga() {
  yield takeLatest(FETCH_EXPERIMENTS_REQUESTED, onFetchExperiments);
}
