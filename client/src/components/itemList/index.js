import React, { Component } from 'react';

import { isEmpty } from 'lodash-es';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import ItemListItem from './item';

class ItemList extends Component {
  render() {

    const {
      items,
      title,
      onAdd
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
                <ItemListItem
                  {...this.props}
                  key={item._id}
                  item={item}
                />
              );
            })}
          </Paper>
        </List>
      </div>
    );
  }
}

export default ItemList;
