import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardContent';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { renderFormFields } from '../utils/formGenerator';
import { createBatchFields } from '../utils/fields';
import { validationFactory } from '../utils/formValidation';

class BatchEdit extends Component {

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
    let title = create ? 'Create new batch' : 'Edit batch';
    let fields;
    if (pristine) {
      fields = createBatchFields(initialValues);
    } else {
      fields = createBatchFields(currentValues);
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


BatchEdit = reduxForm({
  form: 'batchEdit',
  validate: validationFactory(createBatchFields())
})(BatchEdit);

export default BatchEdit
