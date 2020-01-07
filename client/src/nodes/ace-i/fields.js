import { required } from '../../utils/formValidation';

import { has } from 'lodash-es';

import {
  PROJECT_NODE,
  COMPOSITION_NODE
} from './hierarchy';

import {
  GLOBAL_SEARCH
} from '../search';

import {
  COMPOSITE_SEARCH
} from './search';

export function createFieldsFactory(nodeType) {
  switch (nodeType) {
    case PROJECT_NODE : {
      return createProjectFields;
    }
    case COMPOSITION_NODE : {
      return createCompositeFields;
    }

    case COMPOSITE_SEARCH : {
      return createCompositeSearchFields;
    }

    default : {
      return () => ({});
    }
  }
}

function createProjectFields(project) {
  let fields = {
    'startDate' : {
      label: 'Start date',
      type: 'date',
      value: project ? project.startDate : (new Date()).toISOString().slice(0,10),
      error: '',
      validate: [required]
    },
    'title' : {
      label: 'Title',
      type: 'text',
      value: project ? project.title : '',
      error: '',
      validate: [required]
    },
    'objective' : {
      label: 'Objective',
      type: 'text',
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
    }
  }
  return fields;
}

function createCompositeSearchFields(filters) {
  let fields = {
    'elements' : {
      label: 'Elements (comma separated)',
      type: 'text',
      value: has(filters, 'elements') ? filters.elements : '',
      error: ''
    },
    'ph' : {
      label: 'pH',
      type: 'text',
      value: has(filters, 'ph') ? filters.ph : '',
      error: ''
    },
    'electrolyte' : {
      label: 'Electrolyte',
      type: 'text',
      value: has(filters, 'electrolyte') ? filters.electrolyte : '',
      error: ''
    },
    'plateId' : {
      label: 'Plate ID',
      type: 'text',
      value: has(filters, 'plateId') ? filters.plateId : '',
      error: ''
    }
  }
  return fields;
}

function createCompositeFields(composite) {
  let fields = {
    'name': {
      label: 'Name',
      type: 'text',
      value: has(composite, 'name') ? composite.name : '',
      error: '',
      validate: [required]
    }
  }
  return fields;
}
