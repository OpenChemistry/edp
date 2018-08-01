import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { createTestFields } from '../utils/fields';
import { fetchExperiment } from '../redux/ducks/experiments';
import { getTest, createTest, updateTest } from '../redux/ducks/tests';

import { TEST_VIEW_ROUTE } from '../routes';

import TestEdit from '../components/testEdit';
import NotFoundPage from '../components/notFound.js';

class TestEditContainer extends Component {
  
  onSubmit = (test) => {
    let actionCreator = this.props.create ? createTest : updateTest;
    test.experimentId = this.props.experimentId;

    let onSubmitPromise = new Promise((resolve, reject) => {
      this.props.dispatch(actionCreator({test, resolve, reject}));
    });

    onSubmitPromise
    .then((val) => {
      this.props.dispatch(fetchExperiment({id: this.props.experimentId}));
      this.props.dispatch(push(`${TEST_VIEW_ROUTE}/${val.id}`));
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
        fields={createTestFields(this.props.test)}
        initialValues={this.props.test}
        onSubmit={this.onSubmit}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  let create = ownProps.match.params.action === 'addtest';
  let test;
  let experimentId;
  if (create) {
    experimentId = ownProps.match.params.id;
  } else {
    let testId = ownProps.match.params.id;
    test = getTest(state, testId);
    experimentId = test.experimentId;
  }
  return {
    create,
    test,
    experimentId
  }
}

export default connect(mapStateToProps)(TestEditContainer);
