import React from 'react';
import { Field } from 'redux-form'

import Checkbox from '@material-ui/core/Checkbox';
// import IconButton from '@material-ui/core/IconButton';
// import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

// import FileUploadIcon from '@material-ui/icons/FileUpload';

export function handleInputChange(event) {
  let value = event.target.value;
  let name = event.target.name;
  let newState = {...this.state};
  newState.fields[name].value = value;
  if (event.target.type === 'checkbox') {
    newState.fields[event.target.name].value = event.target.checked;
  }
  let err = '';
  if (this.state.fields[name].validate) {
    for (let fn of this.state.fields[name].validate) {
      err = fn(value);
      if (err.length > 0) {
        break;
      }
    }
  }
  newState.fields[event.target.name].error = err;
  this.setState(newState);
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
