import { required } from '../../utils/formValidation';

import {
  PROJECT_NODE,
  BATCH_NODE,
  TEST0_NODE
} from './hierarchy';

export function createFieldsFactory(nodeType) {
  switch (nodeType) {
    case PROJECT_NODE : {
      return createProjectFields;
    }

    default : {
      return () => ({});
    }
  }
}

function createProjectFields(project) {
  let fields = {
    'title' : {
      label: 'Title',
      type: 'text',
      value: project ? project.title : '',
      error: '',
      validate: [required]
    },
    'objective' : {
      label: 'Objective',
      type: 'textarea',
      value: project ? project.objective : '',
      error: '',
      validate: [required]
    },
    'motivation' : {
      label: 'Motivation',
      type: 'textarea',
      value: project ? project.motivation : '',
      error: ''
    },
    'public': {
      label: 'Public',
      type: 'checkbox',
      error: ''
    },
    'dataFile' : {
      label: 'Data file',
      type: 'file',
      value: project ? project.dataFile : '',
      error: ''
    },
    'dataFileId' : {
      label: 'Data file',
      type: 'fileId',
      value: project ? project.dataFileId : null,
      error: ''
    },
  }
  return fields;
}
