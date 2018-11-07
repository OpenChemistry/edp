import { createAction, handleActions } from 'redux-actions';

const initialState = {
  samples: [],
  timeseries: {}
}

// Selectors
export const getSamples = (state, platemapId, runId) => {
  return state.composites.samples.filter(val => val.platemapId === platemapId);
}

export const getTimeSerie = (state, sampleId) => state.composites.timeseries[sampleId];

// Actions

export const FETCH_SAMPLES_REQUESTED = 'FETCH_SAMPLES_REQUESTED';
export const FETCH_SAMPLES_SUCCEEDED = 'FETCH_SAMPLES_SUCCEEDED';
export const FETCH_SAMPLES_FAILED = 'FETCH_SAMPLES_FAILED';

export const FETCH_TIMESERIE_REQUESTED = 'FETCH_TIMESERIE_REQUESTED';
export const FETCH_TIMESERIE_SUCCEEDED = 'FETCH_TIMESERIE_SUCCEEDED';
export const FETCH_TIMESERIE_FAILED = 'FETCH_TIMESERIE_FAILED';

// Action creators

export const fetchSamples = createAction(FETCH_SAMPLES_REQUESTED);
export const fetchTimeSerie = createAction(FETCH_TIMESERIE_REQUESTED);

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
  },
  [FETCH_TIMESERIE_SUCCEEDED]: (state, action) => {
    const timeseries = action.payload;
    if (timeseries.length === 0) {
      return state;
    }
    const timeserie = timeseries[0];
    return {...state, timeseries: {...state.timeseries, [timeserie.sampleId]: timeserie.data}};
  },
}, initialState);

export default reducer;
