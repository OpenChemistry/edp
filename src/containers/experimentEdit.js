import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { getExperiment, createExperiment, updateExperiment } from '../redux/ducks/experiments';

import { createExperimentFields } from '../utils/formGenerator';

import {EXPERIMENT_VIEW_ROUTE} from '../routes';

import ExperimentEdit from '../components/experimentEdit';
import NotFoundPage from '../components/notFound.js';

class ExperimentEditContainer extends Component {

  onSubmit = (experiment) => {
    let actionCreator = this.props.create ? createExperiment : updateExperiment;

    let onSubmitPromise = new Promise((resolve, reject) => {
      this.props.dispatch(actionCreator({experiment, resolve, reject}));
    });

    onSubmitPromise
    .then((val) => {
      this.props.dispatch(push(`${EXPERIMENT_VIEW_ROUTE}/${val.id}`));
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
        fields={createExperimentFields(this.props.experiment)}
        initialValues={this.props.experiment}
        onSubmit={this.onSubmit}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  let create = ownProps.match.params.action === 'add';
  let experiment;
  if (!create) {
    let experimentId = ownProps.match.params.id;
    experiment = getExperiment(state, experimentId);
  }
  return {
    create,
    experiment
  }
}

export default connect(mapStateToProps)(ExperimentEditContainer);
