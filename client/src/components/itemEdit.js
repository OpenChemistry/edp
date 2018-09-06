import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardContent';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { renderFormFields } from '../utils/formGenerator';

class ItemEdit extends Component {

  render() {
    const {
      itemName,
      fieldsCreator,
      handleSubmit,
      onSubmit,
      pristine,
      submitting,
      invalid,
      initialValues,
      currentValues,
      create
    } = this.props;

    let title = create ? `Create new ${itemName}` : `Edit  ${itemName}`;
    let fields;
    if (pristine) {
      fields = fieldsCreator(initialValues);
    } else {
      fields = fieldsCreator(currentValues);
    }
    let formFields = renderFormFields(fields);
    return (
      <Card elevation={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
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

export default ItemEdit
