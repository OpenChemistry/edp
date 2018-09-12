import { createAction, handleActions } from 'redux-actions';

import { has } from 'lodash-es';

export const initialState = {
  byId: {},
  fileToId: {},
  rootFolder: null,
  error: null,
};

// Selectors
export const getRootFolder = state => state.files.rootFolder;
export const getUploadByFile = (state, file) => {
  const fileToId = state.files.fileToId;
  const byId = state.files.byId;
  if (has(fileToId, file.fieldId)) {
    const id = fileToId[file.fieldId];
    if (has(byId, id)) {
      return byId[id];
    }
  }
  return null;
}

// Actions
export const UPLOAD_REQUEST =  'UPLOAD_REQUEST';
export const UPLOAD_ERROR = 'UPLOAD_ERROR';
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
export const UPLOAD_COMPLETE =  'UPLOAD_COMPLETE';

export const REQUEST_ROOT_FOLDER = 'REQUEST_ROOT_FOLDER';
export const RECEIVE_ROOT_FOLDER = 'RECEIVE_ROOT_FOLDER';

// Action Creators

export const uploadError = createAction(UPLOAD_ERROR);

export const requestUpload = createAction(UPLOAD_REQUEST, (uploadId, file) => ({ uploadId,  file }));

export const uploadProgress = createAction(UPLOAD_PROGRESS,
  (uploadId, offset, progressEvent) => ({uploadId, offset, progressEvent}));

export const uploadComplete = createAction(UPLOAD_COMPLETE,
  (id) => ({id}));

export const requestRootFolder = createAction(REQUEST_ROOT_FOLDER);
export const receiveRootFolder = createAction(RECEIVE_ROOT_FOLDER, (folder) =>({folder}));

// Reducer

const reducer = handleActions({

  UPLOAD_ERROR: (state, action) => {
    const error = action.payload;
    return {...state, error};
  },

  UPLOAD_REQUEST: (state, action) => {
    const file = action.payload.file;
    const id = action.payload.uploadId;
    let upload = {
      file,
    }

    if (action.error) {
      const error = action.error;
      return {...state, error};
    }
    else {
      const byId = {
        ...state.byId,
        [id]: {
          upload,
        }
      }

      const fileToId = {
          ...state.fileToId,
          [file.fieldId]: id
      }

      return {...state, byId, fileToId};
    }

  },

  UPLOAD_PROGRESS: (state, action) => {
    const progressEvent = action.payload.progressEvent;
    const offset = action.payload.offset;
    const id = action.payload.uploadId;
    const currentUpload = state.byId[id];
    const progress = offset + progressEvent.loaded;

    const upload = {...currentUpload, progress}
    const byId = {
        ...state.byId,
        [id]: upload,
      }

    return {...state,  byId };
  },

  UPLOAD_COMPLETE: (state, action) => {
    const id = action.payload.id;
    let {[id]: omit, ...byId} = state.byId;

    return {...state,  byId };
  },

  REQUEST_ROOT_FOLDER: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },

  RECEIVE_ROOT_FOLDER: (state, action) => {
    const rootFolder = action.payload.folder;


    return {...state,  rootFolder };
  },
}, initialState);

export default reducer;
