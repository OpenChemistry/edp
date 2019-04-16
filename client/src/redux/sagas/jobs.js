import { call, put, all, takeEvery } from 'redux-saga/effects'
import { get } from '../../rest/jobs';
import {
  loadJobs,
  requestJobs,
  receiveJobs,
  loadJobById,
  requestJobById,
  receiveJobById
} from '../ducks/jobs';

function* fetchJobs(action) {
  try {
    const jobs = yield call(get);
    yield put(receiveJobs({jobs}));
  } catch(error) {
    yield put(requestJobs(error))
  }
}

export function* watchLoadJobs() {
  yield takeEvery(loadJobs.toString(), fetchJobs);
}

function* fetchJob(action) {
  try {
    yield put(requestJobById(action.payload.id))
    const job = yield call(get, action.payload.id)
    yield put(receiveJobById(job))
  }
  catch(error) {
    yield put(requestJobById(error))
  }
}

export function* watchLoadJobById() {
  yield takeEvery(loadJobById.toString(), fetchJob);
}


