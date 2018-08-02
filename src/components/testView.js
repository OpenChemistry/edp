import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import { createTestFields } from '../utils/fields';
import { renderDisplayFields } from '../utils/displayGenerator';

class TestView extends Component {
  render() {
    let fields = renderDisplayFields(createTestFields(this.props.test));
    return (
      <Card>
        <CardHeader
          action={
            <IconButton onClick={() => {this.props.onEditTest()}}>
              <EditIcon />
            </IconButton>
          }
          title={`Channel ${this.props.test.channel}`}
          subheader={this.props.test.date}
        />
        <CardContent>
          {fields}
        </CardContent>
      </Card>
    );
  }
}

export default TestView;
