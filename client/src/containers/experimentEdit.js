import React, { Component } from 'react';

import { connect } from 'react-redux';
import { replace } from 'connected-react-router';

import { getFormValues } from 'redux-form';

import { getExperiment, createExperiment, updateExperiment } from '../redux/ducks/experiments';

import {EXPERIMENT_VIEW_ROUTE} from '../routes';

import ExperimentEdit from '../components/experimentEdit';
import NotFoundPage from '../components/notFound.js';

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
      <ExperimentEdit
        create={this.props.create}
        initialValues={this.props.experiment}
        currentValues={this.props.currentValues}
        onSubmit={this.onSubmit}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  let create = ownProps.match.params.action === 'add';
  let experiment;
  if (!create) {
    let experimentId = ownProps.match.params.experimentId;
    experiment = getExperiment(state, experimentId);
  }
  return {
    create,
    experiment,
    currentValues: getFormValues('experimentEdit')(state)
  }
}
ExperimentEditContainer = connect(mapStateToProps)(ExperimentEditContainer);

export default ExperimentEditContainer;
