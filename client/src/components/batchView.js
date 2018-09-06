import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/Edit';

import { createBatchFields } from '../utils/fields';
import { renderDisplayFields } from '../utils/displayGenerator';

class BatchView extends Component {
  render() {
    let fields = renderDisplayFields(createBatchFields(this.props.batch));
    return (
      <Card>
        <CardHeader
          action={
            <IconButton onClick={() => {this.props.onEdit()}}>
              <EditIcon />
            </IconButton>
          }
          title={this.props.batch.title}
          subheader={this.props.batch.startDate}
        />
        <CardContent>
          {fields}
        </CardContent>
      </Card>
    );
  }
}

export default BatchView;
