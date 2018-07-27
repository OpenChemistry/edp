import { createAction, handleActions } from 'redux-actions';
import {
  deleteExperiment as deleteExperimentRest,
  getExperiment as getExperimentRest,
  getExperiments as getExperimentsRest
} from '../../server';
import { getTest } from './tests';

// Selector
export const getExperiments = state => state.experiments;
export const getExperiment = (state, id) => state.experiments[id];
export const getExperimentTests = (state, id) => {
  let experiment = getExperiment(state, id);
  if (!experiment) {
    return {};
  }
  let tests = {};
  for (let testId of experiment.tests) {
    tests[testId] = getTest(state, testId);
  }
  return tests;
};


// Actions

export const CREATE_EXPERIMENT_REQUESTED = 'CREATE_EXPERIMENT_REQUESTED';
export const CREATE_EXPERIMENT_SUCCEEDED = 'CREATE_EXPERIMENT_SUCCEEDED';
export const CREATE_EXPERIMENT_FAILED = 'CREATE_EXPERIMENT_FAILED';
const DELETE_EXPERIMENT = 'DELETE_EXPERIMENT';
const FETCH_EXPERIMENT = 'FETCH_EXPERIMENT';
const FETCH_EXPERIMENTS = 'FETCH_EXPERIMENTS';
// const UPDATE_EXPERIMENT = 'UPDATE_EXPERIMENT';

export const createExperiment = createAction(CREATE_EXPERIMENT_REQUESTED);

export const deleteExperiment = createAction(DELETE_EXPERIMENT, (id) => {
  return {id: deleteExperimentRest(id)};
});

export const fetchExperiment = createAction(FETCH_EXPERIMENT, (id) => {
  return {experiment: getExperimentRest(id)};
});

export const fetchExperiments = createAction(FETCH_EXPERIMENTS, () => {
  return {experiments: getExperimentsRest()};
});

// Reducer

const initialState = {};

const reducer = handleActions({
  CREATE_EXPERIMENT_SUCCEEDED: (state, action) => {
    return {...state, ...{[action.payload.experiment.id]: action.payload.experiment}};
  },
  DELETE_EXPERIMENT: (state, action) => {
    let newState = {...state};
    delete newState[action.payload.id];
    return newState;
  },
  FETCH_EXPERIMENT: (state, action) => {
    return {...state, ...{[action.payload.experiment.id]: action.payload.experiment}};
  },
  FETCH_EXPERIMENTS: (state, action) => {
    return action.payload.experiments;
  },
}, initialState);

export default reducer;
