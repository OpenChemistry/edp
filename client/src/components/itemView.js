import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/Edit';

import { renderDisplayFields } from '../utils/displayGenerator';
import { Avatar } from '@material-ui/core';

class ItemView extends Component {
  render() {
    const {
      item,
      fieldsCreator,
      primaryField,
      primaryPrefix,
      primarySuffix,
      secondaryField,
      secondaryPrefix,
      secondarySuffix,
      color,
      icon,
      onEdit
    } = this.props;
    let fields = renderDisplayFields(
      fieldsCreator(item),
      [primaryField, secondaryField]
    );
    const NodeIcon = icon;
    return (
      <Card>
        <CardHeader
          action={
            <IconButton onClick={() => {onEdit()}}>
              <EditIcon />
            </IconButton>
          }
          title={`${primaryPrefix || ''} ${item[primaryField]} ${primarySuffix || ''}`}
          subheader={`${secondaryPrefix || ''} ${item[secondaryField]} ${secondarySuffix || ''}`}
          avatar={<Avatar style={{backgroundColor: color}}>{<NodeIcon/>}</Avatar>}
        />
        <CardContent>
          {fields}
        </CardContent>
      </Card>
    );
  }
}

export default ItemView;
