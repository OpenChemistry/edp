import React, { Component } from 'react';

import { connect } from 'react-redux';

import { getExperiments, createExperiment, deleteExperiment, fetchExperiment } from '../redux/ducks/experiments';
import { getTests, createTest, deleteTest } from '../redux/ducks/tests';
import TestList from '../components/test';

class TestListContainer extends Component {
  
  onAddExperiment = () => {
    let exp = {text: 'Lulzi'};
    this.props.dispatch(createExperiment({experiment: exp}));
  }

  onDeleteExperiment = (experimentId) => {
    this.props.dispatch(deleteExperiment({id: experimentId}));
  }

  onAddTest = (experimentId) => {
    let test = {text: 'Luls', experimentId: experimentId};
    this.props.dispatch(createTest({test}));
    this.props.dispatch(fetchExperiment({id: experimentId}));
  }

  onDeleteTest = (testId) => {
    let experimentId = this.props.tests[testId].experimentId;
    this.props.dispatch(deleteTest({id: testId}));
    this.props.dispatch(fetchExperiment({id: experimentId}));
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
