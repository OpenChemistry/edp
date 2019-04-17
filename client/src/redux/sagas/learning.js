import { call, put, select, all, takeEvery } from 'redux-saga/effects';
import { isNil } from 'lodash-es';

import {
  fetchModelMetadata,
  receiveModelMetadata,
  runModel,
  receiveModelResult
} from '../../redux/ducks/learning';

import {
  getModelMetadata as getModelMetadataRest,
  runModel as runModelRest
} from '../../rest/learning';

// Fetch metadata

function* onFetchModelMetadata(_action) {
  try {
    const modelMetadata = yield call(getModelMetadataRest);
    yield put(receiveModelMetadata(modelMetadata));
  } catch (e) {
  }
}

export function* fetchModelMetadataSaga() {
  yield takeEvery(fetchModelMetadata.toString(), onFetchModelMetadata);
}

// Run model

function* onRunModel(action) {
  try {
    const { samples, model, parameters } = action.payload;
    const modelResult = yield call(runModelRest, samples, model, parameters);
    yield put(receiveModelResult(modelResult));
  } catch (e) {
  }
}

export function* runModelSaga() {
  yield takeEvery(runModel.toString(), onRunModel);
}
