import React, { Component } from 'react';

import { connect } from 'react-redux';

import { push } from 'connected-react-router';

import { EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getExperiment, getExperimentTests } from '../redux/ducks/experiments';
import { deleteTest } from '../redux/ducks/tests';

import ExperimentView from '../components/experimentView';
import TestList from '../components/testList';
import NotFoundPage from '../components/notFound.js';

class ExperimentViewContainer extends Component {

  onEditExperiment = () => {
    let experimentId = this.props.experiment.id;
    this.props.dispatch(push(`${EXPERIMENT_VIEW_ROUTE}/${experimentId}/edit`));
  }

  onAddTest = () => {
    let experimentId = this.props.experiment.id;
    this.props.dispatch(push(`${EXPERIMENT_VIEW_ROUTE}/${experimentId}/addtest`));
  }

  onOpenTest = (testId) => {
    this.props.dispatch(push(`${TEST_VIEW_ROUTE}/${testId}`));
  }

  onDeleteTest = (testId) => {
    this.props.dispatch(deleteTest({id: testId}));
  }
  
  render() {
    if (this.props.experiment) {
      return (
        <div>
          <ExperimentView
            experiment={this.props.experiment}
            onEditExperiment={this.onEditExperiment}
          />
          <TestList
            tests={this.props.tests}
            onOpenTest={this.onOpenTest}
            onAddTest={this.onAddTest}
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
