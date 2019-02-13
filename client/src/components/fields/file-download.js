import React, { Component } from 'react';

import {isNil} from 'lodash-es';

import { connect } from 'react-redux';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import filesize from 'filesize';
import { getFileById } from '../../redux/ducks/files';
import { CloudDownload } from '@material-ui/icons';
import girderClient from '@openchemistry/girder-client';


const style = (theme) => (
  {
    field: {
      width: '100%',
      display: 'flex',
      marginBottom: 2 * theme.spacing.unit,
    },
    textField: {
      flexGrow: 1
    },
    button: {
      marginLeft: theme.spacing.unit
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }
)

class FileDownload extends Component {

  render() {
    const { file, fileId } = this.props;
    const baseUrl = girderClient().getBaseURL();
    const downloadUrl = `${baseUrl}/api/v1/file/${fileId}/download`;
    let name = null;
    let size = null;
    if (!isNil(file)) {
      name = file.name;
      size = filesize(file.size);
    }

    return (
      <span>
        <Button href={downloadUrl} color="primary" variant="outlined" size="small">
          <CloudDownload/>&nbsp;&nbsp;<b>{size}</b>
        </Button>
        &nbsp;&nbsp;
        {name}
      </span>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const file = getFileById(state, ownProps.fileId);
  return {
    file
  };
}

FileDownload = withStyles(style)(FileDownload);
FileDownload = connect(mapStateToProps)(FileDownload)

export default FileDownload;
