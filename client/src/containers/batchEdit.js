import React, { Component } from 'react';

import { connect } from 'react-redux';
import { replace } from 'connected-react-router';

import { getFormValues } from 'redux-form';

import { getBatch, createBatch, updateBatch } from '../redux/ducks/batches';

import {EXPERIMENT_VIEW_ROUTE, BATCH_VIEW_ROUTE} from '../routes';

import BatchEdit from '../components/batchEdit';
import NotFoundPage from '../components/notFound.js';

class BatchEditContainer extends Component {

  onSubmit = (batch) => {
    const {experimentId, create} = this.props;
    const actionCreator = create ? createBatch : updateBatch;
    batch.experimentId = experimentId;

    let onSubmitPromise = new Promise((resolve, reject) => {
      this.props.dispatch(actionCreator({experimentId, batch, resolve, reject}));
    })
    .then((val) => {
        this.props.dispatch(replace(`/${EXPERIMENT_VIEW_ROUTE}/${experimentId}/${BATCH_VIEW_ROUTE}/${val._id}`));
    })
    .catch((err) =>{
    });

    return onSubmitPromise;
  }

  render() {
    
    if (!this.props.create && !this.props.batch) {
      return (
        <NotFoundPage />
      );
    }

    return (
      <BatchEdit
        create={this.props.create}
        initialValues={this.props.batch}
        currentValues={this.props.currentValues}
        onSubmit={this.onSubmit}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const create = ownProps.match.params.action === 'add';
  const experimentId = ownProps.match.params.experimentId;
  const batchId = ownProps.match.params.batchId;
  let batch;
  if (!create) {
    batch = getBatch(state, batchId);
  }
  return {
    create,
    experimentId,
    batchId,
    batch,
    currentValues: getFormValues('batchEdit')(state)
  }
}
BatchEditContainer = connect(mapStateToProps)(BatchEditContainer);

export default BatchEditContainer;
