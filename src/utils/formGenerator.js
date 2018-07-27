import React from 'react';
import { Field } from 'redux-form'

import { required } from './formValidation';

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

import FileUploadIcon from '@material-ui/icons/FileUpload';

export function handleInputChange(event) {
  let value = event.target.value;
  let name = event.target.name;
  let newState = {...this.state};
  newState.fields[name].value = value;
  if (event.target.type === 'checkbox') {
    newState.fields[event.target.name].value = event.target.checked;
  }
  let err = '';
  console.log(this.state.fields[name]);
  if (this.state.fields[name].validate) {
    for (let fn of this.state.fields[name].validate) {
      err = fn(value);
      if (err.length > 0) {
        break;
      }
    }
  }
  console.log(err);
  newState.fields[event.target.name].error = err;
  this.setState(newState);
}

export function createExperimentFields(experiment = undefined) {
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
      error: '',
      validate: [required]
    },
  }
  return fields;
}

export function renderFormFields() {
  let formFields = [];
  for (let key in this.props.fields) {
    const field = this.props.fields[key];
    const multiline = field.type === 'textarea';
    const type = multiline ? 'text' : field.type;
    const label = field.label;
    const disabled = field.hasOwnProperty('disabled') ? field.disabled : false;

    if (type === 'checkbox') {
      formFields.push(
        <Field
          key={key}
          name={key}
          component={renderCheckField}
          label={label}
          disabled={disabled}
        />
      );
    } else {
      formFields.push(
        <Field
          key={key}
          type={type}
          name={key}
          component={renderTextField}
          label={label}
          multiline={multiline}
          rows={4}
          disabled={disabled}
        />
      );
    }
  }
  return formFields;
}

const renderTextField = (field) => {
  return (
    <div style={{marginBottom: "1rem"}}>
      <TextField
        fullWidth
        InputLabelProps={{shrink: true}}
        type={field.type}
        label={field.label}
        error={field.meta.touched && field.meta.error}
        helperText={field.meta.error}
        multiline={field.multiline}
        rows={field.rows}
        disabled={field.disabled}
        {...field.input}
      />
    </div>
  )
};

const renderCheckField = (field) => {
  field = {...field};
  delete field.input.value;
  return (
    <div style={{marginBottom: "1rem"}}>
      <FormControlLabel
        control={
          <Checkbox
            checked={field.input.value}
            disabled={field.disabled}
            {...field.input}
          />
        }
        label={field.label}
      />
    </div>
  )
};

// export function createFields_() {
//   let formFields = [];
//   for (let key in this.state.fields) {
//     const field = this.state.fields[key]; 
//     const multiline = field.type === 'textarea';
//     const type = multiline ? 'text' : field.type;
//     const label = field.label;
//     const value = field.value;
//     const error = field.error;
//     const disabled = field.hasOwnProperty('disabled') ? field.disabled : false;

//     if (type=== 'checkbox') {
//       formFields.push(
//           <FormControlLabel
//             key={key}
//             control={
//               <Checkbox
//                 name={key}
//                 checked={value}
//                 onChange={this.handleInputChange}
//                 value={key}
//                 disabled={disabled}
//               />
//             }
//             label={label}
//           />
//       );
//     } else if (type === 'file') {
//       formFields.push(
//         <div key={key} style={{marginBottom: "1rem"}}>
//           <FormControl error={error.length > 0}>
//             <FormControlLabel
//               control={
//                 <IconButton onClick={() => this.fileUpload.click()} disabled={disabled}>
//                   <FileUploadIcon/>
//                 </IconButton>
//               }
//               label={label + " " + value}
//             />
//             <FormHelperText>{error}</FormHelperText>
//           </FormControl>
//           <input
//             hidden
//             name={key}
//             type="file"
//             ref={(ref) => {this.fileUpload = ref;}}
//             onChange={this.handleInputChange}
//           />
//         </div>
//       )
//     } else {
//       formFields.push(
//         <div key={key} style={{marginBottom: "1rem"}}>
//           <TextField
//             fullWidth
//             name={key}
//             type={type} value={value} label={label}
//             InputLabelProps={{shrink: true}}
//             multiline={multiline}
//             rows={4}
//             onChange={this.handleInputChange}
//             error={error.length > 0}
//             helperText={error}
//             disabled={disabled}
//           >
//           </TextField>
//         </div>
//       );
//     }
//   }
//   return formFields;
// }
