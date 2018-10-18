import React, { Component } from 'react';

import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';

class IngestComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  handleCopy = (event, text) => {
    const dummyEl = document.createElement('textarea');
    dummyEl.value = text;
    event.target.appendChild(dummyEl);
    dummyEl.select();
    document.execCommand('copy');
    event.target.removeChild(dummyEl);
  }

  render() {
    const {ancestors, apiKey} = this.props;

    const command = `python -m pip install edp-cli && edp ingest -k ${apiKey} -u ${window.location.origin}/api/v1 -p ${ancestors[0]['_id']} -c ${ancestors[1]['_id']}`;

    return (
      <div>
        <IconButton onClick={this.handleOpen}>
          <CloudUpload/>
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          scrill='paper'
        >
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
          <DialogActions>
            <Button color="secondary"
              onClick={(e) => {this.handleCopy(e, command)}}
            >
              Copy command
            </Button>
            <Button color="primary" onClick={this.handleClose}>
              Dismiss
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      
    );
  }
}

export default IngestComponent;
