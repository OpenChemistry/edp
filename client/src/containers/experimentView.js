import React, { Component } from 'react';

import { connect } from 'react-redux';

import { push } from 'connected-react-router';

import { EXPERIMENT_VIEW_ROUTE, BATCH_VIEW_ROUTE } from '../routes';
import { getExperiment, fetchExperiment } from '../redux/ducks/experiments';
import { deleteBatch, getExperimentBatches, fetchBatches } from '../redux/ducks/batches';

import ExperimentView from '../components/experimentView';
import BatchList from '../components/batchList';
import NotFoundPage from '../components/notFound.js';

class ExperimentViewContainer extends Component {

  constructor(props) {
    super(props);
    const { experimentId } = props;
    if (experimentId) {
      props.dispatch(fetchExperiment({experimentId}));
      props.dispatch(fetchBatches({experimentId}));
    }
  }

  onEditExperiment = () => {
    const { experimentId } = this.props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/edit`));
  }

  onAddBatch = () => {
    const { experimentId } = this.props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/add`));
  }

  onOpenBatch = (batch) => {
    const { experimentId } = this.props;
    const batchId = batch._id;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}`));
  }

  onDeleteBatch = (batch) => {
    const { experimentId } = this.props;
    const batchId = batch._id;
    this.props.dispatch(deleteBatch({ experimentId, batchId }));
  }
  
  render() {
    if (this.props.experiment) {
      return (
        <div>
          <ExperimentView
            experiment={this.props.experiment}
            onEdit={this.onEditExperiment}
          />
          <BatchList
            batches={this.props.batches}
            onOpen={this.onOpenBatch}
            onAdd={this.onAddBatch}
            onDelete={this.onDeleteBatch}
          />
        </div>
      );
    } else {
      return <NotFoundPage />
    }
  }
}

function mapStateToProps(state, ownProps) {
  const experimentId = ownProps.match.params.experimentId;
  return {
    experimentId,
    experiment: getExperiment(state, experimentId),
    batches: getExperimentBatches(state, experimentId)
  }
}

export default connect(mapStateToProps)(ExperimentViewContainer);
