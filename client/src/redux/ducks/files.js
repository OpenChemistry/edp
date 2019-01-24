import { createAction, handleActions } from 'redux-actions';

export const initialState = {
  byId: {},
  error: null,
};

// Selectors
export const getFileById = (state, id) => state.files.byId[id];

// Actions
export const FETCH_FILE_REQUESTED = 'FETCH_FILE_REQUESTED';
export const FETCH_FILE_SUCCEEDED = 'FETCH_FILE_SUCCEEDED';
export const FETCH_FILE_FAILED = 'FETCH_FILE_FAILED';

// Action Creators

export const fetchFile = createAction(FETCH_FILE_REQUESTED);
export const receiveFile = createAction(FETCH_FILE_SUCCEEDED);

// Reducer

const reducer = handleActions({

  [FETCH_FILE_SUCCEEDED]: (state, action) => {
    const file = action.payload;
    return {...state, byId: {...state.byId, [file._id]: file}};
  }
}, initialState);

export default reducer;
