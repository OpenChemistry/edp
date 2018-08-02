import { required } from './formValidation';

export function createExperimentFields(experiment) {
  let fields = {
    'date' : {
      label: 'Start date',
      type: 'date',
      value: experiment ? experiment.date : (new Date()).toISOString().slice(0,10),
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
    'expDesign': {
      label: 'Experimental design',
      type: 'textarea',
      value: experiment ? experiment.expDesign : '',
      error: '',
      validate: [required]
    },
    'expNotes': {
      label: 'Experimental notes',
      type: 'textarea',
      value: experiment ? experiment.expNotes : '',
      error: '',
    },
    'dataNotes': {
      label: 'Data notes',
      type: 'textarea',
      value: experiment ? experiment.dataNotes : '',
      error: '',
    },
    'completed': {
      label: 'Completed',
      type: 'checkbox',
      value: experiment ? experiment.completed : false,
      error: ''
    },
    'results': {
      label: 'Results',
      type: 'textarea',
      value: experiment ? experiment.results : '',
      disabled: experiment ? !experiment.completed : true,
      error: ''
    },
  }
  return fields;
}

export function createTestFields(test = undefined) {
  let fields = {
    'date' : {
      label: 'Start date',
      type: 'date',
      value: test ? test.date : (new Date()).toISOString().slice(0,10),
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
    'metadataFile' : {
      label: 'Metadata file',
      type: 'file',
      value: test ? test.metadataFile : '',
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
