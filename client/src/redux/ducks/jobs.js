import { createAction, handleActions } from 'redux-actions';

const PREFIX = '@@girder-redux/job/';

const initialState = {
    byId: []
};

//Actions

export const LOAD_JOB_BY_ID  = PREFIX + 'LOAD_JOB_BY_ID';
export const REQUEST_JOB_BY_ID = PREFIX + 'REQUEST_JOB_BY_ID';
export const RECEIVE_JOB   = PREFIX + 'RECEIVE_JOB';

export const LOAD_JOBS = PREFIX + 'LOAD_JOBS';
export const REQUEST_JOBS = PREFIX + 'REQUEST_JOBS';
export const RECEIVE_JOBS = PREFIX + 'RECEIVE_JOBS';



const reducer = handleActions({

    REQUEST_JOB_BY_ID: (state, action) => {
      if (action.error) {
        return {...state, error: action.payload.error};
      }
      else {
        return {...state,  error:null };
      }
    },
    RECEIVE_JOB: (state, action) => {
      const {job} = action.payload;
      const byId = {...state.byId, [job._id]: job };
      return {...state, byId};
    },
    REQUEST_JOBS: (state, action) => {
      if (action.error) {
        return {...state, error: action.payload.error};
      }
      else {
        return {...state,  error:null };
      }
    },
    RECEIVE_JOBS: (state, action) => {
      const {jobs} = action.payload;
      let byId = {};
      byId = jobs.reduce((result, item) => {
        result[item._id] = item;
        return result;
      }, byId);
      return {...state, byId};
    }
}, initialState);

// Action Creators

// Fetch job
export const loadJobById = createAction(LOAD_JOB_BY_ID);
export const requestJobById = createAction(REQUEST_JOB_BY_ID);
export const receiveJobById = createAction(RECEIVE_JOB);

// Fetch jobs
export const loadJobs = createAction(LOAD_JOBS);
export const requestJobs = createAction(REQUEST_JOBS);
export const receiveJobs = createAction(RECEIVE_JOBS);


export default reducer;
