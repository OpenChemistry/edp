import React, { Component } from 'react';

import { reduxForm } from 'redux-form'

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardContent';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { renderFormFields } from '../utils/formGenerator';
import { createTestFields } from '../utils/fields';
import { validationFactory } from '../utils/formValidation';

class TestEdit extends Component {

  renderFormFields;

  constructor(props) {
    super(props);
    this.renderFormFields = renderFormFields.bind(this);
  }

  render() {
    const {handleSubmit, pristine, submitting, invalid} = this.props;
    let title = this.props.create ? 'Create new test' : 'Edit test';
    let formFields = this.renderFormFields();
    return (
      <Card elevation={1}>
        <form onSubmit={handleSubmit}>
        <CardContent>
          <Typography variant="headline">{title}</Typography>
          <br/>
            {formFields}
        </CardContent>
        <CardActions >
          <Button
            disabled={pristine || submitting || invalid}
            variant="contained" color="secondary" type='submit'>
            {this.props.create ? 'Create' : 'Save'}
          </Button>
        </CardActions>
        </form>
      </Card>
    );
  }
}

export default reduxForm({
  form: 'testEdit',
  validate: validationFactory(createTestFields())
})(TestEdit);
