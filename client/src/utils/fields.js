import { required } from './formValidation';

export function createExperimentFields(experiment) {
  let fields = {
    'startDate' : {
      label: 'Start date',
      type: 'date',
      value: experiment ? experiment.startDate : (new Date()).toISOString().slice(0,10),
      error: '',
      validate: [required]
    },
    'title' : {
      label: 'Title',
      type: 'text',
      value: experiment ? experiment.title : '',
      error: '',
      validate: [required]
    },
    'objective' : {
      label: 'Objective',
      type: 'text',
      value: experiment ? experiment.objective : '',
      error: '',
      validate: [required]
    },
  }
  return fields;
}

export function createBatchFields(batch) {
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
      error: '',
      validate: [required]
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
    },
    'dataNotes': {
      label: 'Data notes',
      type: 'textarea',
      value: batch ? batch.dataNotes : '',
      error: '',
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

export function createTestFields(test = undefined) {
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
    }
  }
  return fields;
}
