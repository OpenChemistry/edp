import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

class ItemListItem extends Component {
  render() {
    const {
      item,
      hideDelete,
      onDelete,
      onOpen,
      primaryField,
      primaryPrefix,
      primarySuffix,
      secondaryField,
      secondaryPrefix,
      secondarySuffix,
      color,
      icon
    } = this.props;

    const NodeIcon = icon;

    return (
      <ListItem
        button
        key={item._id}
        onClick={() => {onOpen(item)}}
      >
        <Avatar
          style={{backgroundColor: color}}
        >
          <NodeIcon/>
        </Avatar>
        <ListItemText
          primary={`${primaryPrefix || ''} ${item[primaryField]} ${primarySuffix || ''}`}
          secondary={`${secondaryPrefix || ''} ${item[secondaryField]} ${secondarySuffix || ''}`}
        />
        {!hideDelete &&
          <ListItemSecondaryAction>
          <IconButton onClick={() => {onDelete(item)}}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
        }
      </ListItem>
    );
  }
}

export default ItemListItem;