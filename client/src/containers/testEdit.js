import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { getFormValues } from 'redux-form';
import { getTest, createTest, updateTest } from '../redux/ducks/tests';

import { EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE, BATCH_VIEW_ROUTE } from '../routes';

import TestEdit from '../components/testEdit';
import NotFoundPage from '../components/notFound.js';

class TestEditContainer extends Component {
  
  onSubmit = (test) => {
    const {experimentId, batchId, create} = this.props;
    const actionCreator = create ? createTest : updateTest;
    test.batchId = batchId;

    if (test.metadataFile && test.metadataFile[0]) {
      test.metadataFile = test.metadataFile[0].name;
    }

    if (test.dataFile && test.dataFile[0]) {
      test.dataFile = test.dataFile[0].name;
    }

    let onSubmitPromise = new Promise((resolve, reject) => {
      this.props.dispatch(actionCreator({experimentId, batchId, test, resolve, reject}));
    })
    .then((val) => {
      // this.props.dispatch(fetchExperiment({id: val.experimentId}));
      if (create) {
        this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}`));
      } else {
        this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}/${TEST_VIEW_ROUTE}/${val._id}`));
      }
    })
    .catch((err) =>{
    });

    return onSubmitPromise;
  }

  render() {
    
    if (!this.props.create && !this.props.test) {
      return (
        <NotFoundPage />
      );
    }

    return (
      <TestEdit
        create={this.props.create}
        initialValues={this.props.test}
        currentValues={this.props.currentValues}
        onSubmit={this.onSubmit}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const create = ownProps.match.params.action === 'add';
  const experimentId = ownProps.match.params.experimentId;
  const batchId = ownProps.match.params.batchId;
  const testId = ownProps.match.params.testId;
  let test;
  if (!create) {
    test = getTest(state, testId);
  }
  return {
    create,
    experimentId,
    batchId,
    testId,
    test,
    currentValues: getFormValues('testEdit')(state)
  }
}

export default connect(mapStateToProps)(TestEditContainer);
