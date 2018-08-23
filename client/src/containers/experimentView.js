import React, { Component } from 'react';

import { connect } from 'react-redux';

import { push } from 'connected-react-router';

import { EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getExperiment } from '../redux/ducks/experiments';
import { deleteTest, getExperimentTests, fetchExperimentTests } from '../redux/ducks/tests';

import ExperimentView from '../components/experimentView';
import TestList from '../components/testList';
import NotFoundPage from '../components/notFound.js';

class ExperimentViewContainer extends Component {

  constructor(props) {
    super(props);

    if (props.experimentId) {
      props.dispatch(fetchExperimentTests(props.experimentId));
    }
  }

  onEditExperiment = () => {
    let experimentId = this.props.experiment._id;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/edit`));
  }

  onAddTest = () => {
    let experimentId = this.props.experiment._id;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/addtest`));
  }

  onOpenTest = (test) => {
    let experimentId = this.props.experiment._id;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${TEST_VIEW_ROUTE}/${test._id}`));
  }

  onDeleteTest = (test) => {
    this.props.dispatch(deleteTest({test}));
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
  let experimentId = ownProps.match.params.experimentId;
  return {
    experimentId,
    experiment: getExperiment(state, experimentId),
    tests: getExperimentTests(state, experimentId)
  }
}

export default connect(mapStateToProps)(ExperimentViewContainer);
