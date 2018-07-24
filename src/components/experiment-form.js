import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardContent';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import FileUploadIcon from '@material-ui/icons/FileUpload';

import {required} from '../utils/form-validation';

class ExperimentForm extends Component {

  fileUpload;

  constructor(props) {
    super(props);
    this.state = {};
    this.state.fields = {
      'dateTime' : {
        label: 'Start time',
        type: 'date',
        value: (new Date()).toISOString().slice(0,10),
        error: '',
        validate: [required]
      },
      'id' : {
        label: 'Experiment ID',
        type: 'text',
        value: '',
        error: '',
        validate: [required]
      },
      'deviceId' : {
        label: 'Device ID',
        type: 'text',
        value: '',
        error: ''
      },
      'motivation': {
        label: 'Motivation',
        type: 'text',
        value: '',
        error: '',
        validate: [required]
      },
      'file' : {
        label: 'Upload file',
        type: 'file',
        value: '',
        error: '',
        validate: [required]
      },
      'expDesign': {
        label: 'Experimental design',
        type: 'textarea',
        value: '',
        error: '',
        validate: [required]
      },
      'expNotes': {
        label: 'Experimental notes',
        type: 'textarea',
        value: '',
        error: '',
      },
      'dataNotes': {
        label: 'Data notes',
        type: 'textarea',
        value: '',
        error: '',
      },
      'results': {
        label: 'Results',
        type: 'textarea',
        value: '',
        error: '',
        validate: [required]
      },
      'hasAux' : {
        label: 'Has aux',
        type: 'checkbox',
        value: false,
        error: ''
      },
      'hasSpecial' : {
        label: 'Has special',
        type: 'checkbox',
        value: false,
        error: ''
      }
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    // console.log(event.target.name, event.target.value, event.target.type);
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

  handleFileChange(event) {
    // console.log(event);
    let value = event.target.value;
    let name = event.target.name;
    console.log(name, value);
  }

  render() {
    let formFields = [];
    for (let key in this.state.fields) {
      let type = this.state.fields[key].type;
      let label = this.state.fields[key].label;
      let value = this.state.fields[key].value;
      let error = this.state.fields[key].error;
      let multiline = type === 'textarea';
      type = multiline ? 'text' : type;

      if (type=== 'checkbox') {
        formFields.push(
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  name={key}
                  checked={value}
                  onChange={this.handleInputChange}
                  value={key}
                />
              }
              label={label}
            />
        );
      } else if (type === 'file') {
        formFields.push(
          <div key={key} style={{marginBottom: "1rem"}}>
            <FormControl error={error.length > 0}>
              <FormControlLabel
                control={
                  <IconButton onClick={() => this.fileUpload.click()}>
                    <FileUploadIcon/>
                  </IconButton>
                }
                label={label + " " + value}
              />
              <FormHelperText>{error}</FormHelperText>
            </FormControl>
            <input
              hidden
              name={key}
              type="file"
              ref={(ref) => {this.fileUpload = ref;}}
              onChange={this.handleInputChange}
            />
          </div>
        )
      } else {
        formFields.push(
          <div key={key} style={{marginBottom: "1rem"}}>
            <TextField
              fullWidth
              name={key}
              type={type} value={value} label={label}
              InputLabelProps={{shrink: true}}
              multiline={multiline}
              rows={4}
              onChange={this.handleInputChange}
              error={error.length > 0}
              helperText={error}
            >
            </TextField>
          </div>
        );
      }
    }

    return (
      <div>
        <Card elevation={1}>
          <CardContent>
            <Typography variant="headline">New Experiment</Typography>
            <br/>
            <form>
            {formFields}
            </form>
          </CardContent>
          <CardActions >
            <Button variant="contained" color="secondary" >
              Upload
            </Button>
          </CardActions>
        </Card>
      </div>
    )
  }

}

export default ExperimentForm;
