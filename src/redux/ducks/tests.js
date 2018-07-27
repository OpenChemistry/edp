import { createAction, handleActions } from 'redux-actions';
import {
  createTest as createTestRest,
  deleteTest as deleteTestRest,
  getTest as getTestRest,
  getTests as getTestsRest
} from '../../server';

// Selector
export const getTests = state => state.tests;
export const getTest = (state, id) => state.tests[id];

// Actions
const CREATE_TEST = 'CREATE_TEST';
const DELETE_TEST = 'DELETE_TEST';
const FETCH_TEST = 'FETCH_TEST';
const FETCH_TESTS = 'FETCH_TESTS';

export const createTest = createAction(CREATE_TEST, (test) => {
  return {test: createTestRest(test)};
});

export const deleteTest = createAction(DELETE_TEST, (id) => {
  return {id: deleteTestRest(id)};
});

export const fetchTest = createAction(FETCH_TEST, (id) => {
  return {test: getTestRest(id)};
});

export const fetchTests = createAction(FETCH_TESTS, () => {
  return {tests: getTestsRest()};
});

// Reducer

const initialState = {};

const reducer = handleActions(new Map([
  [
    createTest, (state, action) => {
      return {...state, ...{[action.payload.test.id]: action.payload.test}};
    },
  ],

  [
    deleteTest, (state, action) => {
      let newState = {...state};
      delete newState[action.payload.id];
      return newState;
    },
  ],

  [
    fetchTest, (state, action) => {
      return {...state, ...{[action.payload.test.id]: action.payload.test}};
    },
  ],

  [
    fetchTests, (state, action) => {
      return action.payload.tests;
    },
  ],
]), initialState);

export default reducer;
