import { createAction, handleActions } from 'redux-actions';

// Selectors

export const getBatches = (state) => state.batches;
export const getBatch = (state, id) => state.batches[id];
export const getExperimentBatches = (state, experimentId) => {
  let experimentBatches = {};
  let batches = getBatches(state);
  for (let batchId in batches) {
    let batch = batches[batchId];
    if (batch.experimentId === experimentId) {
      experimentBatches[batchId] = batch;
    }
  }
  return experimentBatches;
};

// Actions

export const CREATE_BATCH_REQUESTED = 'CREATE_BATCH_REQUESTED';
export const CREATE_BATCH_SUCCEEDED = 'CREATE_BATCH_SUCCEEDED';
export const CREATE_BATCH_FAILED = 'CREATE_BATCH_FAILED';

export const FETCH_BATCH_REQUESTED = 'FETCH_BATCH_REQUESTED';
export const FETCH_BATCH_SUCCEEDED = 'FETCH_BATCH_SUCCEEDED';
export const FETCH_BATCH_FAILED = 'FETCH_BATCH_FAILED';

export const UPDATE_BATCH_REQUESTED = 'UPDATE_BATCH_REQUESTED';
export const UPDATE_BATCH_SUCCEEDED = 'UPDATE_BATCH_SUCCEEDED';
export const UPDATE_BATCH_FAILED = 'UPDATE_BATCH_FAILED';

export const DELETE_BATCH_REQUESTED = 'DELETE_BATCH_REQUESTED';
export const DELETE_BATCH_SUCCEEDED = 'DELETE_BATCH_SUCCEEDED';
export const DELETE_BATCH_FAILED = 'DELETE_BATCH_FAILED';

export const FETCH_BATCHES_REQUESTED = 'FETCH_BATCHES_REQUESTED';
export const FETCH_BATCHES_SUCCEEDED = 'FETCH_BATCHES_SUCCEEDED';
export const FETCH_BATCHES_FAILED = 'FETCH_BATCHES_FAILED';

// Action creators

export const createBatch = createAction(CREATE_BATCH_REQUESTED);
export const fetchBatch = createAction(FETCH_BATCH_REQUESTED);
export const updateBatch = createAction(UPDATE_BATCH_REQUESTED);
export const deleteBatch = createAction(DELETE_BATCH_REQUESTED);
export const fetchBatches = createAction(FETCH_BATCHES_REQUESTED);

// Reducer

const initialState = {};

const reducer = handleActions({
  CREATE_BATCH_SUCCEEDED: (state, action) => {
    return {...state, [action.payload.batch._id]: action.payload.batch};
  },
  FETCH_BATCH_SUCCEEDED: (state, action) => {
    return {...state, [action.payload.batch._id]: action.payload.batch};
  },
  UPDATE_BATCH_SUCCEEDED: (state, action) => {
    return {...state, [action.payload.batch._id]: action.payload.batch};
  },
  FETCH_BATCHES_SUCCEEDED: (state, action) => {
    let batches = {...state};
    return action.payload.batches.reduce((result, item) => {
      result[item._id] = item;
      return result;
    }, batches);
  },
  DELETE_BATCH_SUCCEEDED: (state, action) => {
    let newState = {...state};
    delete newState[action.payload.id];
    return newState;
  },
}, initialState);

export default reducer;
