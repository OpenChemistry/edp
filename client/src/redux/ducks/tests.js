import { createAction, handleActions } from 'redux-actions';

// Selector

export const getTests = state => state.tests;
export const getTest = (state, id) => state.tests[id];
export const getExperimentTests = (state, experimentId) => {
  let experimentTests = {};
  let tests = getTests(state);
  for (let testId in tests) {
    let test = tests[testId];
    if (test.experimentId === experimentId) {
      experimentTests[testId] = test;
    }
  }
  return experimentTests;
};

// Actions

export const CREATE_TEST_REQUESTED = 'CREATE_TEST_REQUESTED';
export const CREATE_TEST_SUCCEEDED = 'CREATE_TEST_SUCCEEDED';
export const CREATE_TEST_FAILED = 'CREATE_TEST_FAILED';

export const FETCH_TEST_REQUESTED = 'FETCH_TEST_REQUESTED';
export const FETCH_TEST_SUCCEEDED = 'FETCH_TEST_REQUESTED';
export const FETCH_TEST_FAILED = 'FETCH_TEST_REQUESTED';

export const UPDATE_TEST_REQUESTED = 'UPDATE_TEST_REQUESTED';
export const UPDATE_TEST_SUCCEEDED = 'UPDATE_TEST_SUCCEEDED';
export const UPDATE_TEST_FAILED = 'UPDATE_TEST_FAILED';

export const DELETE_TEST_REQUESTED = 'DELETE_TEST_REQUESTED';
export const DELETE_TEST_SUCCEEDED = 'DELETE_TEST_SUCCEEDED';
export const DELETE_TEST_FAILED = 'DELETE_TEST_FAILED';

export const FETCH_EXPERIMENT_TESTS_REQUESTED = 'FETCH_EXPERIMENT_TESTS_REQUESTED';
export const FETCH_EXPERIMENT_TESTS_SUCCEEDED = 'FETCH_EXPERIMENT_TESTS_SUCCEEDED';
export const FETCH_EXPERIMENT_TESTS_FAILED = 'FETCH_EXPERIMENT_TESTS_FAILED';

// Action creators

export const createTest = createAction(CREATE_TEST_REQUESTED);
export const fetchTest = createAction(FETCH_TEST_REQUESTED);
export const updateTest = createAction(UPDATE_TEST_REQUESTED);
export const deleteTest = createAction(DELETE_TEST_REQUESTED);
export const fetchExperimentTests = createAction(FETCH_EXPERIMENT_TESTS_REQUESTED);

// Reducer

const initialState = {};

const reducer = handleActions({
  CREATE_TEST_SUCCEEDED: (state, action) => {
    return {...state, ...{[action.payload.test._id]: action.payload.test}};
  },
  UPDATE_TEST_SUCCEEDED: (state, action) => {
    return {...state, ...{[action.payload.test._id]: action.payload.test}};
  },
  DELETE_TEST_SUCCEEDED: (state, action) => {
    let newState = {...state};
    delete newState[action.payload.id];
    return newState;
  },
  FETCH_TEST_SUCCEEDED: (state, action) => {
    return {...state, ...{[action.payload.test._id]: action.payload.test}};
  },
  FETCH_EXPERIMENT_TESTS_SUCCEEDED: (state, action) => {
    let tests = {...state};
    return action.payload.tests.reduce((result, item) => {
      result[item._id] = item;
      return result;
    }, tests);
  },
}, initialState);

export default reducer;
