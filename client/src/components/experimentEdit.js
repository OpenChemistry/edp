import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardContent';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { renderFormFields } from '../utils/formGenerator';
import { createExperimentFields } from '../utils/fields';
import { validationFactory } from '../utils/formValidation';

class ExperimentEdit extends Component {

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      initialValues,
      currentValues,
      create
    } = this.props;
    let title = create ? 'Create new experiment' : 'Edit experiment';
    let fields;
    if (pristine) {
      fields = createExperimentFields(initialValues);
    } else {
      fields = createExperimentFields(currentValues);
    }
    let formFields = renderFormFields(fields);
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
            variant="contained" color="secondary" type='submit'
            disabled={pristine || submitting || invalid}
          >
            {create ? 'Create' : 'Save'}
          </Button>
        </CardActions>
        </form>
      </Card>
    );
  }
}


ExperimentEdit = reduxForm({
  form: 'experimentEdit',
  validate: validationFactory(createExperimentFields())
})(ExperimentEdit);

export default ExperimentEdit
