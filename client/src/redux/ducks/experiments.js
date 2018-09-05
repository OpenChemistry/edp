import { createAction, handleActions } from 'redux-actions';

// Selectors

export const getExperiments = (state) => state.experiments;
export const getExperiment = (state, id) => state.experiments[id];

// Actions

export const CREATE_EXPERIMENT_REQUESTED = 'CREATE_EXPERIMENT_REQUESTED';
export const CREATE_EXPERIMENT_SUCCEEDED = 'CREATE_EXPERIMENT_SUCCEEDED';
export const CREATE_EXPERIMENT_FAILED = 'CREATE_EXPERIMENT_FAILED';

export const FETCH_EXPERIMENT_REQUESTED = 'FETCH_EXPERIMENT_REQUESTED';
export const FETCH_EXPERIMENT_SUCCEEDED = 'FETCH_EXPERIMENT_SUCCEEDED';
export const FETCH_EXPERIMENT_FAILED = 'FETCH_EXPERIMENT_FAILED';

export const UPDATE_EXPERIMENT_REQUESTED = 'UPDATE_EXPERIMENT_REQUESTED';
export const UPDATE_EXPERIMENT_SUCCEEDED = 'UPDATE_EXPERIMENT_SUCCEEDED';
export const UPDATE_EXPERIMENT_FAILED = 'UPDATE_EXPERIMENT_FAILED';

export const DELETE_EXPERIMENT_REQUESTED = 'DELETE_EXPERIMENT_REQUESTED';
export const DELETE_EXPERIMENT_SUCCEEDED = 'DELETE_EXPERIMENT_SUCCEEDED';
export const DELETE_EXPERIMENT_FAILED = 'DELETE_EXPERIMENT_FAILED';

export const FETCH_EXPERIMENTS_REQUESTED = 'FETCH_EXPERIMENTS_REQUESTED';
export const FETCH_EXPERIMENTS_SUCCEEDED = 'FETCH_EXPERIMENTS_SUCCEEDED';
export const FETCH_EXPERIMENTS_FAILED = 'FETCH_EXPERIMENTS_FAILED';

// Action creators

export const createExperiment = createAction(CREATE_EXPERIMENT_REQUESTED);
export const fetchExperiment = createAction(FETCH_EXPERIMENT_REQUESTED);
export const updateExperiment = createAction(UPDATE_EXPERIMENT_REQUESTED);
export const deleteExperiment = createAction(DELETE_EXPERIMENT_REQUESTED);
export const fetchExperiments = createAction(FETCH_EXPERIMENTS_REQUESTED);

// Reducer

const initialState = {};

const reducer = handleActions({
  CREATE_EXPERIMENT_SUCCEEDED: (state, action) => {
    return {...state, ...{[action.payload.experiment._id]: action.payload.experiment}};
  },
  FETCH_EXPERIMENT_SUCCEEDED: (state, action) => {
    return {...state, ...{[action.payload.experiment._id]: action.payload.experiment}};
  },
  UPDATE_EXPERIMENT_SUCCEEDED: (state, action) => {
    return {...state, ...{[action.payload.experiment._id]: action.payload.experiment}};
  },
  FETCH_EXPERIMENTS_SUCCEEDED: (state, action) => {
    let experiments = {};
    return action.payload.experiments.reduce((result, item) => {
      result[item._id] = item;
      return result;
    }, experiments);
    // return action.payload.experiments;
  },
  DELETE_EXPERIMENT_SUCCEEDED: (state, action) => {
    let newState = {...state};
    delete newState[action.payload.id];
    return newState;
  },
}, initialState);

export default reducer;
