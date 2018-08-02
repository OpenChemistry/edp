import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

class ExperimentList extends Component {
  render() {

    return (
      <div>
        <List >
          <div style={{paddingBottom: '0.5rem'}}>
            <ListItem>
              <Typography variant='title'>
                Experiments
              </Typography>
              <ListItemSecondaryAction>
                <IconButton onClick={() => {this.props.onAddExperiment()}}>
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </div>
          <Paper>
            {Object.values(this.props.experiments).map((experiment) => {
              return (
                <ListItem
                  button
                  key={experiment.id}
                  onClick={() => {this.props.onOpenExperiment(experiment.id)}}
                >
                  <ListItemText
                    primary={experiment.title}
                    secondary={experiment.date}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => {this.props.onDeleteExperiment(experiment.id)}}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </Paper>
        </List>
      </div>
    );
  }
}

export default ExperimentList;
