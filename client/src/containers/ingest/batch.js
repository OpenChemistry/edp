import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash-es';

import {
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@material-ui/core';

import { getIngestKey, fetchIngestKey } from '../../redux/ducks/apiKeys';
import Ingest from '../../components/ingest';

class IngestContainer extends Component {
  componentDidMount() {
    const { apiKey, dispatch } = this.props;
    if (isNil(apiKey)) {
      dispatch(fetchIngestKey());
    }
  }
  render() {
    const {ancestors, apiKey} = this.props;

    if (ancestors.length !== 2 || isNil(apiKey)) {
      return null;
    }

    const command = `python -m pip install edp-cli && edp ingest -k ${apiKey} -u ${window.location.origin}/api/v1 -p ${ancestors[0]['_id']} -c ${ancestors[1]['_id']}`;

    return (
      <Ingest command={command}>
        <DialogTitle>
          Ingest batch
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Navigate to the directory where the batch tests are located.
            The directory name will be used as batch title.
          </DialogContentText>
          <pre>
            cd /path/to/batch
          </pre>
          <DialogContentText>
            Run the command below
          </DialogContentText>
          <pre style={{whiteSpace: 'pre-wrap'}}>
            {command}
          </pre>
        </DialogContent>
      </Ingest>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const apiKey = getIngestKey(state);
  return {apiKey};
}

IngestContainer = connect(mapStateToProps)(IngestContainer);

export default IngestContainer;
