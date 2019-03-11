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

    case BATCH_NODE : {
      return createBatchFields;
    }

    case TEST0_NODE : {
      return createTest0Fields;
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
      error: ''
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
    }
  }
  return fields;
}

function createBatchFields(batch) {
  let fields = {
    'startDate' : {
      label: 'Start date',
      type: 'date',
      value: batch ? batch.startDate : (new Date()).toISOString().slice(0,10),
      error: ''
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
    'structFile' : {
      label: 'MATLAB Struct file',
      type: 'file',
      value: batch ? batch.structFile : '',
      error: ''
    },
    'structFileId' : {
      label: 'MATLAB Struct file',
      type: 'fileId',
      value: batch ? batch.structFileId : null,
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

function createTest0Fields(test = undefined) {
  let fields = {
    'startDate' : {
      label: 'Start date',
      type: 'date',
      value: test ? test.startDate : (new Date()).toISOString().slice(0,10),
      error: '',
      validate: [required]
    },
    'name' : {
      label: 'Name',
      type: 'text',
      value: test ? test.title : '',
      error: '',
      validate: [required]
    },
    'batteryType' : {
      label: 'Battery type',
      type: 'text',
      value: test ? test.batteryType : '',
      error: ''
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
      type: 'file',
      value: test ? test.scheduleFile : '',
      error: ''
    },
    'scheduleFileId' : {
      label: 'Schedule file',
      type: 'fileId',
      value: test ? test.scheduleFileId : null,
      error: ''
    },
    'metaDataFile' : {
      label: 'Metadata file',
      type: 'file',
      value: test ? test.metaDataFile : '',
      error: ''
    },
    'metaDataFileId' : {
      label: 'Metadata file',
      type: 'fileId',
      value: test ? test.metaDataFileId : null,
      error: ''
    },
    'dataFile' : {
      label: 'Data file',
      type: 'file',
      value: test ? test.dataFile : '',
      error: ''
    },
    'dataFileId' : {
      label: 'Data file',
      type: 'fileId',
      value: test ? test.dataFileId : null,
      error: ''
    },
    'comments': {
      label: 'Comments',
      type: 'textarea',
      value: test ? test.comments : '',
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
