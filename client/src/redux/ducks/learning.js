import { createAction, handleActions } from 'redux-actions';

const initialState = {
  modelMetadata: {},
  modelData: {}
}

// Selectors
export const getModelMetadata = (state) => {
  return state.learning.modelMetadata;
}

export const getModelData = (state, modelId) => {
  return state.learning.modelData[modelId];
}

// Actions

export const FETCH_MODEL_METADATA_REQUESTED = 'FETCH_MODEL_METADATA_REQUESTED';
export const FETCH_MODEL_METADATA_SUCCEEDED = 'FETCH_MODEL_METADATA_SUCCEEDED';
export const FETCH_MODEL_METADATA_FAILED = 'FETCH_MODEL_METADATA_FAILED';

export const RUN_MODEL_REQUESTED = 'RUN_MODEL_REQUESTED';
export const RUN_MODEL_SUCCEEDED = 'RUN_MODEL_SUCCEEDED';
export const RUN_MODEL_FAILED = 'RUN_MODEL_FAILED';

// Action creators

export const fetchModelMetadata = createAction(FETCH_MODEL_METADATA_REQUESTED);
export const receiveModelMetadata = createAction(FETCH_MODEL_METADATA_SUCCEEDED);
export const runModel = createAction(RUN_MODEL_REQUESTED);
export const receiveModelResult = createAction(RUN_MODEL_SUCCEEDED);

// Reducer

const reducer = handleActions({
  [FETCH_MODEL_METADATA_REQUESTED]: (_state, _action) => {
    return {...initialState};
  },
  [FETCH_MODEL_METADATA_SUCCEEDED]: (state, action) => {
    const models = action.payload;
    const modelMetadata = {};
    for (let model of models) {
      modelMetadata[model.fileName] = model;
    }
    return {...state, modelMetadata};
  },
  [RUN_MODEL_SUCCEEDED]: (state, action) => {
    const result = action.payload;
    const { fileName} = result.model;
    const modelData = {...state.modelData};
    modelData[fileName] = result;
    return {...state, modelData};
  },
}, initialState);

export default reducer;
