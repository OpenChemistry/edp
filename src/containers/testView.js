import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../redux/store';
import { push } from 'connected-react-router'
import { EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getTest } from '../redux/ducks/tests';
import { getExperiment } from '../redux/ducks/experiments';

import TestView from '../components/testView';
import NotFoundPage from '../components/notFound.js';

class TestViewContainer extends Component {

  onEditTest = () => {
    store.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${this.props.experiment.id}/${TEST_VIEW_ROUTE}/${this.props.test.id}/edit`));
  }
 
  render() {
    if (this.props.test) {
      return (
        <div>
          <TestView
            test={this.props.test}
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
  let experimentId = ownProps.match.params.experimentId
  let testId = ownProps.match.params.testId;
  let test = getTest(state, testId);
  let experiment = getExperiment(state, experimentId);

  if (!experiment) {
    test = null;
  } else if ( test && test.experimentId !== experimentId) {
    test = null;
  }
  return {
    test,
    experiment
  }
}

export default connect(mapStateToProps)(TestViewContainer);
