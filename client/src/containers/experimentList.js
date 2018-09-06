import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import { EXPERIMENT_VIEW_ROUTE } from '../routes';
import { getExperiments, deleteExperiment } from '../redux/ducks/experiments';

import ExperimentList from '../components/experimentList';

class ExperimentListContainer extends Component {
  
  onAddExperiment = () => {
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/add`));
  }

  onOpenExperiment = (experiment) => {
    const experimentId = experiment._id;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}`));
  }

  onDeleteExperiment = (experiment) => {
    const experimentId = experiment._id;
    this.props.dispatch(deleteExperiment({experimentId}));
  }

  render() {
    return (
      <ExperimentList
        experiments={this.props.experiments}
        onOpen={this.onOpenExperiment}
        onAdd={this.onAddExperiment}
        onDelete={this.onDeleteExperiment}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    experiments: getExperiments(state)
  }
}

export default connect(mapStateToProps)(ExperimentListContainer);
