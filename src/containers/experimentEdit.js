import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../redux/store';
import { push } from 'connected-react-router';

import { getExperiment, createExperiment } from '../redux/ducks/experiments';

import { createExperimentFields } from '../utils/formGenerator';

import {EXPERIMENT_VIEW_ROUTE} from '../routes';

import ExperimentEdit from '../components/experimentEdit';
import NotFoundPage from '../components/notFound.js';

class ExperimentEditContainer extends Component {
  
  onSubmit = (experiment) => {
    if (this.props.create) {
      store.dispatch(createExperiment({experiment}));
    } else {

    }
    // store.dispatch(push(`${EXPERIMENT_VIEW_ROUTE}/${experiment.id}`))
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
