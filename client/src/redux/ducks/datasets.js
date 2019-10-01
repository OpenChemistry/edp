import { createAction, handleActions } from 'redux-actions';

// Selectors

export const getDatasets = (state) => state.datasets;

// Actions

const FETCH_DATASETS_REQUESTED = 'FETCH_DATASETS_REQUESTED';
const FETCH_DATASETS_SUCCEEDED = 'FETCH_DATASETS_SUCCEEDED';
const FETCH_DATASETS_FAILED = 'FETCH_DATASETS_FAILED';

// Action creators

export const fetchDatasets = createAction(FETCH_DATASETS_REQUESTED);
export const receiveDatasets = createAction(FETCH_DATASETS_SUCCEEDED);

// Reducer

const initialState = {}

const reducer = handleActions({
  [FETCH_DATASETS_SUCCEEDED]: (state, action) => {
    return action.payload;
  }
}, initialState);

export default reducer;
