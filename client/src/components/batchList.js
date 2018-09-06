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

class BatchList extends Component {
  render() {

    return (
      <div>
        <List >
          <div style={{paddingBottom: '0.5rem'}}>
            <ListItem>
              <Typography variant='title'>
                Batches
              </Typography>
              <ListItemSecondaryAction>
                <IconButton onClick={() => {this.props.onAdd()}}>
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </div>
          <Paper>
            {Object.values(this.props.batches).map((batch) => {
              return (
                <ListItem
                  button
                  key={batch._id}
                  onClick={() => {this.props.onOpen(batch)}}
                >
                  <ListItemText
                    primary={batch.title}
                    secondary={batch.startDate}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => {this.props.onDelete(batch)}}>
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

export default BatchList;
