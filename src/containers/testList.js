import React, { Component } from 'react';

import { connect } from 'react-redux';

import store from '../redux/store';
import { getExperiments, createExperiment, deleteExperiment, fetchExperiment } from '../redux/ducks/experiments';
import { getTests, createTest, deleteTest } from '../redux/ducks/tests';
import TestList from '../components/test';

class TestListContainer extends Component {
  
  onAddExperiment = () => {
    let exp = {text: 'Lulzi'};
    store.dispatch(createExperiment(exp));
  }

  onDeleteExperiment = (experimentId) => {
    store.dispatch(deleteExperiment(experimentId));
  }

  onAddTest = (experimentId) => {
    let test = {text: 'Luls', experimentId: experimentId};
    store.dispatch(createTest(test));
    store.dispatch(fetchExperiment(experimentId));
  }

  onDeleteTest = (testId) => {
    let experimentId = this.props.tests[testId].experimentId;
    store.dispatch(deleteTest(testId));
    store.dispatch(fetchExperiment(experimentId));
  }

  render() {
    return (
      <TestList
        experiments={this.props.experiments}
        tests={this.props.tests}
        onAddExperiment={this.onAddExperiment}
        onAddTest={this.onAddTest}
        onDeleteExperiment={this.onDeleteExperiment}
        onDeleteTest={this.onDeleteTest}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    experiments: getExperiments(state),
    tests: getTests(state),
  }
}

export default connect(mapStateToProps)(TestListContainer);
