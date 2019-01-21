import { createAction, handleActions } from 'redux-actions';
import { merge } from "lodash"
import { ArrayDataProvider, SplineDataProvider } from 'composition-plot/dist/data-provider/spectrum';

const initialState = {
  samples: [],
  timeseries: {},
  fittedTimeseries: {}
}

// Selectors
export const getSamples = (state, platemapId, runId) => {
  return state.composites.samples.filter(val => val.platemapId === platemapId);
}

export const getTimeSerie = (state, sampleId, fitted) => {
  if (fitted) {
    return state.composites.fittedTimeseries[sampleId];
  } else {
    return state.composites.timeseries[sampleId];
  }
}

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

function toArrayProvider(timeserie) {
  const provider = new ArrayDataProvider();
  for (let key in timeserie.data) {
    provider.setArray(key, timeserie.data[key]);
  }
  return provider;
}

function toSplineProvider(timeserie) {
  const provider = new SplineDataProvider();
  for (let key in timeserie.data) {
    provider.setArray(key, timeserie.data[key]);
  }
  return provider;
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
    const { timeseries, fitted } = action.payload;
    if (timeseries.length === 0) {
      return state;
    }

    // For now merge into a single object
    const timeserie = merge({}, ...timeseries);

    if ( fitted ) {
      return {...state, fittedTimeseries: {...state.fittedTimeseries, [timeserie.sampleId]: toSplineProvider(timeserie)}};
    } else {
      return {...state, timeseries: {...state.timeseries, [timeserie.sampleId]: toArrayProvider(timeserie)}};
    }
  },
}, initialState);

export default reducer;
