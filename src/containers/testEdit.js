import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../redux/store';
import { push } from 'connected-react-router';

import { getTest } from '../redux/ducks/tests';

import ExperimentEdit from '../components/experimentEdit';
import NotFoundPage from '../components/notFound.js';

class TestEditContainer extends Component {
  
  render() {
    
    if (!this.props.create && !this.props.test) {
      return (
        <NotFoundPage />
      );
    }

    return (
      <h3>
        {this.props.create ? "Creating" : "Editing"} test
      </h3>
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
