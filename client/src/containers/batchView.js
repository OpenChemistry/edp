import React, { Component } from 'react';

import { connect } from 'react-redux';

import { push } from 'connected-react-router';

import { EXPERIMENT_VIEW_ROUTE, BATCH_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getBatch, fetchBatch } from '../redux/ducks/batches';
import { deleteTest, getBatchTests, fetchTests } from '../redux/ducks/tests';

import BatchView from '../components/batchView';
import TestList from '../components/testList';
import NotFoundPage from '../components/notFound.js';

class BatchViewContainer extends Component {

  constructor(props) {
    super(props);

    const { experimentId, batchId } = props;
    props.dispatch(fetchBatch({experimentId, batchId}));
    props.dispatch(fetchTests({experimentId, batchId}));
  }

  onEditBatch = () => {
    const { experimentId, batchId } = props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}/edit`));
  }

  onAddTest = () => {
    const { experimentId, batchId } = props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}/${TEST_VIEW_ROUTE}/add`));
  }

  onOpenTest = (test) => {
    const { experimentId, batchId } = props;
    const testId = test._id;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}/${TEST_VIEW_ROUTE}/${testId}`));
  }

  onDeleteTest = (test) => {
    const { experimentId, batchId } = props;
    const testId = test._id;
    this.props.dispatch(deleteTest({experimentId, batchId, testId}));
  }
  
  render() {
    if (this.props.batch) {
      return (
        <div>
          <BatchView
            batch={this.props.batch}
            onEdit={this.onEditBatch}
          />
          <TestList
            tests={this.props.tests}
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
