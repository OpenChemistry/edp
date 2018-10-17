import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash-es';

import Ingest from '../components/ingest';

class IngestContainer extends Component {
  render() {
    let {ancestors, apiKey} = this.props;
    apiKey = "asd12334";

    if (ancestors.length !== 2 || isNil(apiKey)) {
      return null;
    }

    return (
      <Ingest {...this.props}/>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {};
}

IngestContainer = connect(mapStateToProps)(IngestContainer);

export default IngestContainer;
