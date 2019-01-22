import { createAction, handleActions } from 'redux-actions';

// Selectors

export const getServerSettings = (state) => state.settings;

// Actions

const FETCH_SETTINGS_REQUESTED = 'FETCH_SETTINGS_REQUESTED';
const FETCH_SETTINGS_SUCCEEDED = 'FETCH_SETTINGS_SUCCEEDED';
const FETCH_SETTINGS_FAILED = 'FETCH_SETTINGS_FAILED';

// Action creators

export const fetchServerSettings = createAction(FETCH_SETTINGS_REQUESTED);
export const receiveServerSettings = createAction(FETCH_SETTINGS_SUCCEEDED);

// Reducer

const initialState = {}

const reducer = handleActions({
  [FETCH_SETTINGS_SUCCEEDED]: (state, action) => {
    return action.payload;
  }
}, initialState);

export default reducer;
