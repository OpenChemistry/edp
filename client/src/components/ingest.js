import React, { Component } from 'react';

import {
  Button,
  IconButton,
  Dialog,
  DialogActions
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
    const {command, children} = this.props;

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
          {children}
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
