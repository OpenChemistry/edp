import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/Edit';

import { createExperimentFields } from '../utils/fields';
import { renderDisplayFields } from '../utils/displayGenerator';

class ExperimentView extends Component {
  render() {
    let fields = renderDisplayFields(createExperimentFields(this.props.experiment));
    return (
      <Card>
        <CardHeader
          action={
            <IconButton onClick={() => {this.props.onEdit()}}>
              <EditIcon />
            </IconButton>
          }
          title={this.props.experiment.title}
          subheader={this.props.experiment.startDate}
        />
        <CardContent>
          {fields}
        </CardContent>
      </Card>
    );
  }
}

export default ExperimentView;
