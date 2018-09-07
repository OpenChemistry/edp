import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { auth } from '@openchemistry/girder-redux';

import { ROOT_ROUTE, EXPERIMENT_VIEW_ROUTE, BATCH_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';
import { getExperiment } from '../redux/ducks/experiments';
import { getBatch } from '../redux/ducks/batches';
import { getTest } from '../redux/ducks/tests';

import BreadCrumb from '../components/breadCrumb';

class BreadCrumbContainer extends Component {

  onHomeClick = () => {
    this.props.dispatch(push(ROOT_ROUTE));
  }

  onExperimentClick = () => {
    const { experimentId } = this.props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}`));
  }

  onBatchClick = () => {
    const { experimentId, batchId } = this.props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}`));
  }

  onTestClick = () => {
    const { experimentId, batchId, testId } = this.props;
    this.props.dispatch(push(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${batchId}/${TEST_VIEW_ROUTE}/${testId}`));
  }

  render() {
    if (!this.props.me) {
      return null;
    }

    return (
      <BreadCrumb
        {...this.props}
        onHomeClick={this.onHomeClick}
        onExperimentClick={this.onExperimentClick}
        onBatchClick={this.onBatchClick}
        onTestClick={this.onTestClick}
      />
    );
  }
}

function mapStateToProps(state) {
  let experimentIdGroup = 3;
  let batchIdGroup = 6;
  let testIdGroup = 9;
  let regexStr = `((${EXPERIMENT_VIEW_ROUTE})\\/(\\w+))(\\/(${BATCH_VIEW_ROUTE})\\/(\\w+))?(\\/(${TEST_VIEW_ROUTE})\\/(\\w+))?`;
  let regex = new RegExp(regexStr);
  let mo = state.router.location.pathname.match(regex);
  let experimentId;
  let batchId;
  let testId;
  let experiment;
  let batch;
  let test;
  let me = auth.selectors.getMe(state);
  if (mo) {
    experimentId = mo[experimentIdGroup];
    batchId = mo[batchIdGroup];
    testId = mo[testIdGroup];
    experiment = getExperiment(state, experimentId);
    batch = getBatch(state, batchId);
    test = getTest(state, testId);
  }
  
  return {
    experimentId,
    batchId,
    testId,
    experiment,
    batch,
    test,
    me
  }
}

export default connect(mapStateToProps)(BreadCrumbContainer);
