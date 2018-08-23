import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { EXPERIMENT_LIST_ROUTE, EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getExperiment } from '../redux/ducks/experiments';
import { getTest } from '../redux/ducks/tests';

import BreadCrumb from '../components/breadCrumb';

class BreadCrumbContainer extends Component {

  onHomeClick = () => {
    this.props.dispatch(push(EXPERIMENT_LIST_ROUTE));
  }

  onExperimentClick = () => {
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${this.props.experiment._id}`));
  }

  onTestClick = () => {
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${this.props.experiment._id}/${TEST_VIEW_ROUTE}/${this.props.test._id}`));
  }

  render() {
    return (
      <BreadCrumb
        experiment={this.props.experiment}
        test={this.props.test}
        onHomeClick={this.onHomeClick}
        onExperimentClick={this.onExperimentClick}
        onTestClick={this.onTestClick}
      />
    );
  }
}

function mapStateToProps(state) {
  let experimentIdGroup = 3;
  let testIdGroup = 6;
  let regexStr = `((${EXPERIMENT_VIEW_ROUTE})\\/(\\w+))(\\/(${TEST_VIEW_ROUTE})\\/(\\w+))?`;
  let regex = new RegExp(regexStr);
  let mo = state.router.location.pathname.match(regex);
  let experiment;
  let test;
  if (mo) {
    let experimentId = mo[experimentIdGroup];
    let testId = mo[testIdGroup];
    experiment = getExperiment(state, experimentId);
    test = getTest(state, testId);
  }
  
  return {
    experiment,
    test
  }
}

export default connect(mapStateToProps)(BreadCrumbContainer);
