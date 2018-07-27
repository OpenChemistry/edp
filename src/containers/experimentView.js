import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../redux/store';
import { push } from 'connected-react-router';

import { EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getExperiment, getExperimentTests, fetchExperiment } from '../redux/ducks/experiments';
import { deleteTest } from '../redux/ducks/tests';

import ExperimentView from '../components/experimentView';
import TestList from '../components/testList';
import NotFoundPage from '../components/notFound.js';

class ExperimentViewContainer extends Component {

  onEditExperiment = () => {
    let experimentId = this.props.experiment.id;
    store.dispatch(push(`${EXPERIMENT_VIEW_ROUTE}/${experimentId}/edit`));
  }

  onAddTest = () => {
    let experimentId = this.props.experiment.id;
    store.dispatch(push(`${EXPERIMENT_VIEW_ROUTE}/${experimentId}/addtest`));
  }

  onOpenTest = (testId) => {
    store.dispatch(push(`${TEST_VIEW_ROUTE}/${testId}`));
  }

  onDeleteTest = (testId) => {
    store.dispatch(deleteTest(testId));
  }
  
  render() {
    if (this.props.experiment) {
      return (
        <div>
          <ExperimentView
            experiment={this.props.experiment}
            onEditExperiment={this.onEditExperiment}
            onAddTest={this.onAddTest}
          />
          <TestList
            tests={this.props.tests}
            onOpenTest={this.onOpenTest}
            onDeleteTest={this.onDeleteTest}
          />
        </div>
      );
    } else {
      return <NotFoundPage />
    }
  }
}

function mapStateToProps(state, ownProps) {
  let experimentId = ownProps.match.params.id;
  return {
    experiment: getExperiment(state, experimentId),
    tests: getExperimentTests(state, experimentId)
  }
}

export default connect(mapStateToProps)(ExperimentViewContainer);
