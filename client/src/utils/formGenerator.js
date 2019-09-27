import React from 'react';
import { Field } from 'redux-form'

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FileInputField from '../components/fields/file';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export function renderFormFields(fields) {
  let formFields = [];
  for (let key in fields) {
    const field = fields[key];
    const multiline = field.type === 'textarea';
    const type = multiline ? 'text' : field.type;
    const label = field.label;
    const disabled = field.hasOwnProperty('disabled') ? field.disabled : false;
    const hidden = field.hasOwnProperty('hidden') ? field.hidden : false;
    const validate = field.validate || [];
    const options = field.options || {};
    const value = field.value;

    switch (type) {
      case 'checkbox': {
        formFields.push(
          <div
            key={key}
            hidden={hidden}
          >
            <Field
              name={key}
              component={renderCheckField}
              label={label}
              disabled={disabled}
              hidden={hidden}
            />
          </div>
        );
        break;
      }

      case 'file': {
        formFields.push(
          <div
            key={key}
            hidden={hidden}
          >
            <Field
              type='text'
              name={key}
              component={FileInputField}
              label={label}
              disabled={disabled}
              hidden={hidden}
            />
          </div>
        );
        break;
      }

      case 'date':
      case 'text': {
        formFields.push(
          <div
            key={key}
            hidden={hidden}
          >
            <Field
              type={type}
              name={key}
              component={renderTextField}
              label={label}
              multiline={multiline}
              rows={6}
              disabled={disabled}
              hidden={hidden}
              validate={validate}
            />
          </div>
        );
        break;
      }
      case 'select': {
        formFields.push(
          <div
            key={key}
            hidden={hidden}
          >
            <Field
              name={key}
              component={renderSelectField}
              label={label}
              disabled={disabled}
              hidden={hidden}
              options={options}
            />
          </div>
        );
        break;
      }

      default: {
        break;
      }
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
  const checked = field.input.value;
  delete field.input.value;
  return (
    <div style={{marginBottom: "1rem"}}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            disabled={field.disabled}
            {...field.input}
          />
        }
        label={field.label}
      />
    </div>
  )
};

const renderSelectField = (field) => {
  const menuItems = [];
  for (const op in field.options) {
    menuItems.push(
      <MenuItem key={op} value={op}>{field.options[op]}</MenuItem>
    );
  }
  return (
    <div style={{marginBottom: "1rem"}}>
      <FormControl>
        <InputLabel htmlFor="selectField">{field.label}</InputLabel>
          <Select
          inputProps={{
            id: 'selectField',
          }}
          {...field.input}
        >
          {menuItems}
        </Select>
      </FormControl>
    </div>
  )
};