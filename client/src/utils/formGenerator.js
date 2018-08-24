import React from 'react';
import { Field } from 'redux-form'

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
// import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

import FileInputField from '../components/fields/file';
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
    } else if (type === 'file') {
      formFields.push(
        <Field
          key={key}
          type='text'
          name={key}
          component={FileInputField}
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
          rows={6}
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
        error={field.meta.touched && !!field.meta.error}
        helperText={field.meta.error ? field.meta.error : ''}
        multiline={field.multiline}
        rows={field.rows}
        disabled={field.disabled}
        {...field.input}
        // onChange={(e)=>{console.log(e); field.input.onChange(e);}}
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

const renderFileField = (field) => {
  return (
    <div style={{display: 'flex', marginBottom: "1rem"}}>
      <div style={{flexGrow: 1}}>
        <TextField
          fullWidth
          disabled={true}
          value={field.input.value}
          label={field.label}
          onClick={() => {
            if (this[`${field.input.name}Input`]) {
              this[`${field.input.name}Input`].click();
            }
          }}
        />
      </div>
      <Button
        disabled={field.disabled}
        onClick={() => {
          if (this[`${field.input.name}Input`]) {
            this[`${field.input.name}Input`].click();
          }
        }}
      >
        Select file
        <input
          ref={ref => {this[`${field.input.name}Input`] = ref;}}
          type="file"
          onChange={field.input.onChange}
          hidden
        />
      </Button>
    </div>
  );
}
