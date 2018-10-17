import { required } from './formValidation';

import { has } from 'lodash-es';

import {
  PROJECT_NODE,
  CYCLE_NODE,
  POSTMORTEM_NODE,
  BATCH_NODE,
  TEST0_NODE,
  TEST1_NODE
} from './nodes';

import {
  GLOBAL_SEARCH
} from './search';

export function createFieldsFactory(nodeType) {
  switch (nodeType) {
    case PROJECT_NODE : {
      return createProjectFields;
    }

    case CYCLE_NODE : {
      return createCycleFields;
    }

    case POSTMORTEM_NODE : {
      return createPostmortemFields;
    }

    case BATCH_NODE : {
      return createBatchFields
    }

    case TEST0_NODE : {
      return createTest0Fields;
    }

    case TEST1_NODE : {
      return createTest1Fields;
    }

    case GLOBAL_SEARCH : {
      return createGlobalSearchFields
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
    }
  }
  return fields;
}

function createCycleFields(cycle) {
  let fields = {
    'startDate' : {
      label: 'Start date',
      type: 'date',
      value: cycle ? cycle.startDate : (new Date()).toISOString().slice(0,10),
      error: '',
      validate: [required]
    },
    'title' : {
      label: 'Title',
      type: 'text',
      value: cycle ? cycle.title : 'Cell cycling',
      error: '',
      validate: [required]
    },
    'comments': {
      label: 'Comments',
      type: 'textarea',
      value: cycle ? cycle.comments : '',
      error: ''
    },
  }
  return fields;
}

function createPostmortemFields(postmortem) {
  let fields = {
    'startDate' : {
      label: 'Start date',
      type: 'date',
      value: postmortem ? postmortem.startDate : (new Date()).toISOString().slice(0,10),
      error: '',
      validate: [required]
    },
    'title' : {
      label: 'Title',
      type: 'text',
      value: postmortem ? postmortem.title : 'Post cycle dissection',
      error: '',
      validate: [required]
    },
    'comments': {
      label: 'Comments',
      type: 'textarea',
      value: postmortem ? postmortem.comments : '',
      error: ''
    },
  }
  return fields;
}

function createBatchFields(batch) {
  let fields = {
    'startDate' : {
      label: 'Start date',
      type: 'date',
      value: batch ? batch.startDate : (new Date()).toISOString().slice(0,10),
      error: '',
      validate: [required]
    },
    'title' : {
      label: 'Title',
      type: 'text',
      value: batch ? batch.title : '',
      error: '',
      validate: [required]
    },
    'motivation' : {
      label: 'Motivation',
      type: 'textarea',
      value: batch ? batch.motivation : '',
      error: ''
    },
    'experimentalDesign': {
      label: 'Experimental design',
      type: 'textarea',
      value: batch ? batch.experimentalDesign : '',
      error: '',
      validate: [required]
    },
    'experimentalNotes': {
      label: 'Experimental notes',
      type: 'textarea',
      value: batch ? batch.experimentalNotes : '',
      error: '',
      validate: [required]
    },
    'dataNotes': {
      label: 'Data notes',
      type: 'textarea',
      value: batch ? batch.dataNotes : '',
      error: '',
      validate: [required]
    },
    'completed': {
      label: 'Completed',
      type: 'checkbox',
      value: batch ? batch.completed : false,
      error: ''
    },
    'results': {
      label: 'Results',
      type: 'textarea',
      value: batch ? batch.results : '',
      disabled: batch ? !batch.completed : true,
      hidden: batch ? !batch.completed : true,
      error: ''
    },
  }
  return fields;
}

function createTest0Fields(test = undefined) {
  let fields = {
    'startDate' : {
      label: 'Start date',
      type: 'date',
      value: test ? test.startDate : (new Date()).toISOString().slice(0,10),
      error: '',
      validate: [required]
    },
    'batteryType' : {
      label: 'Battery type',
      type: 'text',
      value: test ? test.batteryType : '',
      error: '',
      validate: [required]
    },
    'cellId' : {
      label: 'Cell ID',
      type: 'text',
      value: test ? test.cellId : '',
      error: '',
      validate: [required]
    },
    'supplier' : {
      label: 'Supplier',
      type: 'text',
      value: test ? test.supplier : '',
      error: ''
    },
    'packingDate' : {
      label: 'Packing date',
      type: 'date',
      value: test ? test.packingDate : '',
      error: ''
    },
    'channel' : {
      label: 'Channel',
      type: 'text',
      value: test ? test.channel : '',
      error: '',
      validate: [required]
    },
    'scheduleFile' : {
      label: 'Schedule file',
      type: 'text',
      value: test ? test.scheduleFile : '',
      error: '',
      validate: [required]
    },
    'metaDataFile' : {
      label: 'Metadata file',
      type: 'file',
      value: test ? test.metaDataFile : '',
      error: ''
    },
    'dataFile' : {
      label: 'Data file',
      type: 'file',
      value: test ? test.dataFile : '',
      error: ''
    },
    'comments': {
      label: 'Comments',
      type: 'textarea',
      value: test ? test.comments : '',
      error: ''
    },
    'metaDataFileId' : {
      label: 'Metadata file',
      type: 'fileId',
      value: test ? test.metaDataFileId : null,
      error: ''
    },
    'dataFileId' : {
      label: 'Data file',
      type: 'fileId',
      value: test ? test.dataFileId : null,
      error: ''
    },
  }
  return fields;
}

function createTest1Fields(test = undefined) {
  let fields = {
    'startDate' : {
      label: 'Start date',
      type: 'date',
      value: test ? test.startDate : (new Date()).toISOString().slice(0,10),
      error: '',
      validate: [required]
    },
    'cellId' : {
      label: 'Cell ID',
      type: 'text',
      value: test ? test.cellId : '',
      error: '',
      validate: [required]
    },
    'imageFile' : {
      label: 'Image file',
      type: 'file',
      value: test ? test.imageFile : '',
      error: ''
    },
    'comments': {
      label: 'Comments',
      type: 'textarea',
      value: test ? test.comments : '',
      error: ''
    },
    'imageFileId' : {
      label: 'Image file',
      type: 'fileId',
      value: test ? test.imageFileId : null,
      thumbnail: test ? test.imageFileIdThumbnail : null,
      error: ''
    }
  }
  return fields;
}

function createGlobalSearchFields(filters) {
  let fields = {
    'title' : {
      label: 'Title',
      type: 'text',
      value: has(filters, 'title') ? filters.title : '',
      error: ''
    },
    'supplier' : {
      label: 'Supplier',
      type: 'text',
      value: has(filters, 'supplier') ? filters.supplier : '',
      error: ''
    },
    'cellId' : {
      label: 'Cell ID',
      type: 'text',
      value: has(filters, 'cellId') ? filters.cellId : '',
      error: ''
    }
  }
  return fields;
}
