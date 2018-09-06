import React, { Component } from 'react';

import { connect } from 'react-redux';

import { push } from 'connected-react-router';

import { EXPERIMENT_VIEW_ROUTE, BATCH_VIEW_ROUTE } from '../routes';
import { getExperiment, fetchExperiment } from '../redux/ducks/experiments';
import { deleteBatch, getExperimentBatches, fetchBatches } from '../redux/ducks/batches';

import ItemView from '../components/itemView';
import ItemList from '../components/itemList';
import NotFoundPage from '../components/notFound.js';

import { createExperimentFields } from '../utils/fields';

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
          <ItemView
            item={this.props.experiment}
            onEdit={this.onEditExperiment}
            fieldsCreator={createExperimentFields}
            primaryField="title"
            secondaryField="startDate"
          />
          <ItemList
            items={this.props.batches}
            title="Batches"
            primaryField="title"
            secondaryField="startDate"
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
