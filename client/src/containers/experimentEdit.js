import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import { connect } from 'react-redux';
import { replace } from 'connected-react-router';

import { getFormValues } from 'redux-form';

import { getExperiment, createExperiment, updateExperiment } from '../redux/ducks/experiments';

import {EXPERIMENT_VIEW_ROUTE} from '../routes';

import ItemEdit from '../components/itemEdit';
import NotFoundPage from '../components/notFound.js';

import { createExperimentFields } from '../utils/fields';
import { validationFactory } from '../utils/formValidation';

class ExperimentEditContainer extends Component {

  onSubmit = (experiment) => {
    let actionCreator = this.props.create ? createExperiment : updateExperiment;

    let onSubmitPromise = new Promise((resolve, reject) => {
      this.props.dispatch(actionCreator({experiment, resolve, reject}));
    })
    .then((val) => {
        this.props.dispatch(replace(`/${EXPERIMENT_VIEW_ROUTE}/${val._id}`));
    })
    .catch((err) =>{
    });

    return onSubmitPromise;
  }

  render() {
    
    if (!this.props.create && !this.props.experiment) {
      return (
        <NotFoundPage />
      );
    }

    return (
      <ItemEdit
        {...this.props}
        itemName="experiment"
        fieldsCreator={createExperimentFields}
        onSubmit={this.onSubmit}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const create = ownProps.match.params.action === 'add';
  const experimentId = ownProps.match.params.experimentId;
  let experiment;
  if (!create) {
    experiment = getExperiment(state, experimentId);
  }
  return {
    create,
    experimentId,
    experiment,
    initialValues: experiment,
    currentValues: getFormValues('experimentEdit')(state)
  }
}

ExperimentEditContainer = reduxForm({
  form: 'experimentEdit',
  enableReinitialize: true,
  validate: validationFactory(createExperimentFields())
})(ExperimentEditContainer);

ExperimentEditContainer = connect(mapStateToProps)(ExperimentEditContainer);

export default ExperimentEditContainer;
