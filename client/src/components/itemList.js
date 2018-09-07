import React, { Component } from 'react';

import { isEmpty } from 'lodash-es';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

class ItemList extends Component {
  render() {

    const {
      items,
      title,
      onAdd,
      onDelete,
      onOpen,
      primaryField,
      primaryPrefix,
      primarySuffix,
      secondaryField,
      secondaryPrefix,
      secondarySuffix,
    } = this.props;

    return (
      <div>
        <List >
          <div style={{paddingBottom: '0.5rem'}}>
            <ListItem>
              <Typography variant='title'>
                {title}
              </Typography>
              <ListItemSecondaryAction>
                <IconButton onClick={() => {onAdd()}}>
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </div>
          <Paper>
            { isEmpty(items) &&
            <ListItem>
              <Typography align='center' variant='subheading' color="textSecondary">
                There are no {title.toLowerCase()} yet. Click the <b>+</b> button above to add some
              </Typography>
            </ListItem>
            }
            {Object.values(items).map((item) => {
              return (
                <ListItem
                  button
                  key={item._id}
                  onClick={() => {onOpen(item)}}
                >
                  <ListItemText
                    primary={`${primaryPrefix || ''} ${item[primaryField]} ${primarySuffix || ''}`}
                    secondary={`${secondaryPrefix || ''} ${item[secondaryField]} ${secondarySuffix || ''}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => {onDelete(item)}}>
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

export default ItemList;
