import React, { Component } from 'react';

import { reduxForm } from 'redux-form'

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardContent';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { renderFormFields } from '../utils/formGenerator';

class ExperimentEdit extends Component {

  handleInputChange;
  renderFormFields;

  constructor(props) {
    super(props);
    this.renderFormFields = renderFormFields.bind(this);
  }

  render() {
    let title = this.props.create ? 'Create new experiment' : 'Edit experiment';
    let formFields = this.renderFormFields();
    return (
      <Card elevation={1}>
        <form onSubmit={this.props.handleSubmit}>
        <CardContent>
          <Typography variant="headline">{title}</Typography>
          <br/>
            {formFields}
        </CardContent>
        <CardActions >
          <Button variant="contained" color="secondary" type='submit'>
            {this.props.create ? 'Create' : 'Save'}
          </Button>
        </CardActions>
        </form>
      </Card>
    );
  }
}

export default reduxForm({
  form: 'experimentEdit'
})(ExperimentEdit);
