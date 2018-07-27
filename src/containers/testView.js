import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../redux/store';
import { push } from 'connected-react-router'
import { EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getTest } from '../redux/ducks/tests';

import TestView from '../components/testView';
import NotFoundPage from '../components/notFound.js';

class TestViewContainer extends Component {

  onEditTest = () => {
    store.dispatch(push(`${TEST_VIEW_ROUTE}/${this.props.test.id}/edit`));
  }

  onBackToExperiment = () => {
    store.dispatch(push(`${EXPERIMENT_VIEW_ROUTE}/${this.props.test.experimentId}`));
  }
  
  render() {
    if (this.props.test) {
      return (
        <div>
          <TestView
            test={this.props.test}
            onBackToExperiment={this.onBackToExperiment}
            onEditTest={this.onEditTest}
          />
        </div>
      );
    } else {
      return <NotFoundPage />
    }
  }
}

function mapStateToProps(state, ownProps) {
  let testId = ownProps.match.params.id;
  return {
    test: getTest(state, testId)
  }
}

export default connect(mapStateToProps)(TestViewContainer);
