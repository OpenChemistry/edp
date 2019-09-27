import { createAction, handleActions } from 'redux-actions';

// Selectors

export const getDatabases = (state) => state.databases;

// Actions

const FETCH_DATABASES_REQUESTED = 'FETCH_DATABASES_REQUESTED';
const FETCH_DATABASES_SUCCEEDED = 'FETCH_DATABASES_SUCCEEDED';
const FETCH_DATABASES_FAILED = 'FETCH_DATABASES_FAILED';

// Action creators

export const fetchDatabases = createAction(FETCH_DATABASES_REQUESTED);
export const receiveDatabases = createAction(FETCH_DATABASES_SUCCEEDED);

// Reducer

const initialState = {}

const reducer = handleActions({
  [FETCH_DATABASES_SUCCEEDED]: (state, action) => {
    return action.payload;
  }
}, initialState);

export default reducer;
