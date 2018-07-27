import { CREATE_EXPERIMENT_REQUESTED, CREATE_EXPERIMENT_SUCCEEDED, CREATE_EXPERIMENT_FAILED, createExperiment} from '../ducks/experiments';
import {
  createExperiment as createExperimentRest,
  deleteExperiment as deleteExperimentRest,
  getExperiment as getExperimentRest,
  getExperiments as getExperimentsRest
} from '../../server';

import { EXPERIMENT_VIEW_ROUTE } from '../../routes';

import { push } from 'connected-react-router';
import { call, put, takeEvery } from 'redux-saga/effects'

function* onCreateExperiment(action) {
  try {
    const experiment = yield call(createExperimentRest, action.payload.experiment);
    yield put({type: CREATE_EXPERIMENT_SUCCEEDED, payload: {experiment}});
    yield put(push(`${EXPERIMENT_VIEW_ROUTE}/${experiment.id}`));
  } catch (e) {
    yield put({type: CREATE_EXPERIMENT_FAILED, error: e});
  }
}

export function* createExperimentSaga() {
  yield takeEvery(CREATE_EXPERIMENT_REQUESTED, onCreateExperiment);
}
