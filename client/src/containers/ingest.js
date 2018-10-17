import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash-es';

import { getIngestKey, fetchIngestKey } from '../redux/ducks/apiKeys';
import Ingest from '../components/ingest';

class IngestContainer extends Component {
  componentDidMount() {
    const { apiKey, dispatch } = this.props;
    if (isNil(apiKey)) {
      dispatch(fetchIngestKey());
    }
  }
  render() {
    let {ancestors, apiKey} = this.props;

    if (ancestors.length !== 2 || isNil(apiKey)) {
      return null;
    }

    return (
      <Ingest {...this.props}/>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const apiKey = getIngestKey(state);
  return {apiKey};
}

IngestContainer = connect(mapStateToProps)(IngestContainer);

export default IngestContainer;
