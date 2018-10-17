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
import { CreateNewFolder } from '@material-ui/icons';

import Highlight from 'react-highlight'

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

  handleCopy = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  render() {
    const {ancestors, apiKey} = this.props;

    const command =
`pip install edp-cli && \\
edp ingest -k ${apiKey} \\
           -u ${window.location.origin}/api/v1 \\
           -p ${ancestors[0]['_id']} \\
           -c ${ancestors[1]['_id']}`;

    return (
      <div>
        <IconButton onClick={this.handleOpen}>
          <CreateNewFolder/>
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
            <Highlight language="bash">
              cd /path/to/batch
            </Highlight>
            <DialogContentText>
              Run the command below
            </DialogContentText>
            <Highlight>
              {command}
            </Highlight>
          </DialogContent>
          <DialogActions>
            <Button color="secondary"
              onClick={() => {this.handleCopy(command)}}
            >
              Copy
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
