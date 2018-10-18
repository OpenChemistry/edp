import { createAction, handleActions } from 'redux-actions';

// Selectors

export const getIngestKey = (state) => state.apiKeys.ingestKey;

// Actions

export const FETCH_INGEST_KEY_REQUESTED = 'FETCH_INGEST_KEY_REQUESTED';
export const FETCH_INGEST_KEY_SUCCEEDED = 'FETCH_INGEST_KEY_SUCCEEDED';
export const FETCH_INGEST_KEY_FAILED = 'FETCH_INGEST_KEY_FAILED';

// Action creators

export const fetchIngestKey = createAction(FETCH_INGEST_KEY_REQUESTED);

// Reducer

const initialState = {
  ingestKey: null
}

const reducer = handleActions({
  [FETCH_INGEST_KEY_SUCCEEDED]: (state, action) => {
    const key = action.payload;
    return {
      ...state,
      ingestKey: key
    };
  }
}, initialState);

export default reducer;
