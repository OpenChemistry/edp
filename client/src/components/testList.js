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

class TestList extends Component {
  
  render() {
    let tests = [];
    for (let key in this.props.tests) {
      let test = this.props.tests[key];
      if (test) {
        tests.push(
          <ListItem
            button
            key={test.id}
            onClick={() => {this.props.onOpenTest(test.id)}}
          >
            <ListItemText
              primary={`Channel ${test.channel}`}
              secondary={test.date}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => {this.props.onDeleteTest(test.id)}}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      }
    }

    return (
      <List>
        <div style={{paddingTop: '0.5rem', paddingBottom: '0.5rem'}}>
          <ListItem>
            <Typography variant='title'>
              Tests
            </Typography>
            <ListItemSecondaryAction>
              <IconButton onClick={() => {this.props.onAddTest()}}>
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </div>
        <Paper>
          {tests}
        </Paper>
      </List>
    );
  }
}

export default TestList;