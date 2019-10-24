import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { Typography } from '@material-ui/core';

class ItemListItem extends Component {
  render() {
    const {
      item,
      showLabel,
      canEdit,
      onDelete,
      onOpen,
      primaryField,
      primaryPrefix,
      primarySuffix,
      secondaryField,
      secondaryPrefix,
      secondarySuffix,
      color,
      icon,
      label
    } = this.props;

    const NodeIcon = icon;

    return (
      <ListItem
        button
        key={item._id}
        onClick={() => {onOpen(item)}}
      >
        <ListItemAvatar>
          <Avatar
            style={{backgroundColor: color}}
          >
            <NodeIcon/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${primaryPrefix || ''} ${item[primaryField]} ${primarySuffix || ''}`}
          secondary={`${secondaryPrefix || ''} ${item[secondaryField] || ''} ${secondarySuffix || ''}`}
        />
        <ListItemSecondaryAction>
          {canEdit &&
          <IconButton onClick={() => {onDelete(item)}}>
            <DeleteIcon />
          </IconButton>
          }
          {showLabel &&
            <Typography color="textSecondary">
              {label}&nbsp;
            </Typography>
          }
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default ItemListItem;