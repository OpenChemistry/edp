import React, { Component } from 'react';

import { connect } from 'react-redux';

import { push } from 'connected-react-router';

import { EXPERIMENT_VIEW_ROUTE, BATCH_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getBatch, fetchBatch } from '../redux/ducks/batches';
import { deleteTest, getBatchTests, fetchTests } from '../redux/ducks/tests';

import ItemView from '../components/itemView';
import ItemList from '../components/itemList';
import NotFoundPage from '../components/notFound.js';

import { createBatchFields } from '../utils/fields';

class BatchViewContainer extends Component {

  constructor(props) {
    super(props);

    const { experimentId, batchId } = props;
    props.dispatch(fetchBatch({experimentId, batchId}));
    props.dispatch(fetchTests({experimentId, batchId}));
  }

  onEditBatch = () => {
    const { experimentId, batchId } = this.props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}/edit`));
  }

  onAddTest = () => {
    const { experimentId, batchId } = this.props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}/${TEST_VIEW_ROUTE}/add`));
  }

  onOpenTest = (test) => {
    const { experimentId, batchId } = this.props;
    const testId = test._id;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}/${TEST_VIEW_ROUTE}/${testId}`));
  }

  onDeleteTest = (test) => {
    const { experimentId, batchId } = this.props;
    const testId = test._id;
    this.props.dispatch(deleteTest({experimentId, batchId, testId}));
  }
  
  render() {
    if (this.props.batch) {
      return (
        <div>
          <ItemView
            item={this.props.batch}
            onEdit={this.onEditBatch}
            fieldsCreator={createBatchFields}
            primaryField="title"
            secondaryField="startDate"
          />
          <ItemList
            items={this.props.tests}
            title="Tests"
            primaryField="channel"
            secondaryField="startDate"
            primaryPrefix="Channel"
            onOpen={this.onOpenTest}
            onAdd={this.onAddTest}
            onDelete={this.onDeleteTest}
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
  const batchId = ownProps.match.params.batchId;
  return {
    experimentId,
    batchId,
    batch: getBatch(state, batchId),
    tests: getBatchTests(state, batchId)
  }
}

export default connect(mapStateToProps)(BatchViewContainer);
