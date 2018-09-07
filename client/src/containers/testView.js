import React, { Component } from 'react';

import { connect } from 'react-redux';

import { push } from 'connected-react-router'
import { EXPERIMENT_VIEW_ROUTE, BATCH_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getTest, fetchTest } from '../redux/ducks/tests';
import { getBatch } from '../redux/ducks/batches';
import { getExperiment } from '../redux/ducks/experiments';

import ItemView from '../components/itemView';
import NotFoundPage from '../components/notFound.js';

import { createTestFields } from '../utils/fields';

class TestViewContainer extends Component {

  constructor(props) {
    super(props);
    const { experimentId, batchId, testId } = props;
    props.dispatch(fetchTest({experimentId, batchId, testId}));
  }

  onEditTest = () => {
    const { experimentId, batchId, testId } = this.props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}/${TEST_VIEW_ROUTE}/${testId}/edit`));
  }
 
  render() {
    if (this.props.test) {
      return (
        <div>
          <ItemView
            item={this.props.test}
            onEdit={this.onEditTest}
            fieldsCreator={createTestFields}
            primaryField="channel"
            secondaryField="startDate"
            primaryPrefix="Channel"
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
  const testId = ownProps.match.params.testId;

  let experiment = getExperiment(state, experimentId);
  let batch = getBatch(state, batchId);
  let test = getTest(state, testId);

  return {
    experimentId,
    batchId,
    testId,
    experiment,
    batch,
    test
  }
}

export default connect(mapStateToProps)(TestViewContainer);
