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

    if (ancestors.length !== 1 || isNil(apiKey)) {
      return null;
    }

    const command = `python -m pip install edp-cli && edp ingest_composite -k ${apiKey} -u ${window.location.origin}/api/v1 -p ${ancestors[0]['_id']} -d . -m channel.json`;

    return (
      <Ingest command={command}>
        <DialogTitle>
          Ingest composite
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Navigate to the directory where the composite dataset is located.
            The directory name will be used as composite title.
          </DialogContentText>
          <pre>
            cd /path/to/composite
          </pre>
          <DialogContentText>
            Create a file named <b>channel.json</b> containing the mapping between channels and elements.
            For example:
          </DialogContentText>
          <pre>
{`{
  "A": "sn",
  "B": "fe",
  "C": "cu",
  "D": "mn",
  "E": "co",
  "F": "ta"
}`}
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
