import { createAction, handleActions } from 'redux-actions';

const initialState = {
  samples: [],
  timeseries: {}
}

// Selectors
export const getSamples = (state, platemapId, runId) => {
  return state.composite.samples.filter(val => val.platemapId === platemapId && val.runId === runId);
}

export const getTimeSerie = (state, sampleId) => state.composite.timeseries[sampleId];


// Actions

export const FETCH_SAMPLES_REQUESTED = 'FETCH_SAMPLES_REQUESTED';
export const FETCH_SAMPLES_SUCCEEDED = 'FETCH_SAMPLES_SUCCEEDED';
export const FETCH_SAMPLES_FAILED = 'FETCH_SAMPLES_FAILED';

// Action creators

export const fetchSamples = createAction(FETCH_SAMPLES_REQUESTED);


// Reducer

function patchSample(sample, platemapId, runId) {
  sample.platemapId = platemapId;
  sample.runId = runId;
  return sample;
}

const reducer = handleActions({
  [FETCH_SAMPLES_REQUESTED]: (state, action) => {
    return {...state, samples: initialState.samples};
  },
  [FETCH_SAMPLES_SUCCEEDED]: (state, action) => {
    const { samples, platemapId, runId } = action.payload;
    return {...state, samples: samples.map(sample => patchSample(sample, platemapId, runId))};
  }
}, initialState);

export default reducer;
