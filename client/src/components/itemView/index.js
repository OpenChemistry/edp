import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/Edit';

import { renderDisplayFields } from '../../utils/displayGenerator';
import { Avatar } from '@material-ui/core';

import Visualization from './visualization';

class ItemView extends Component {
  render() {
    const {
      canEdit,
      item,
      fieldsCreator,
      primaryField,
      primaryPrefix,
      primarySuffix,
      secondaryField,
      secondaryPrefix,
      secondarySuffix,
      visualizationField,
      color,
      icon,
      onEdit
    } = this.props;
    let fields = renderDisplayFields(
      fieldsCreator(item),
      [primaryField, secondaryField]
    );
    const NodeIcon = icon;
    const editAction = canEdit ? <IconButton onClick={() => {onEdit()}}><EditIcon /></IconButton> : null;
    const visualizationData = item[visualizationField];
    return (
      <div>
        <Card>
          <CardHeader
            action={editAction}
            title={`${primaryPrefix || ''} ${item[primaryField]} ${primarySuffix || ''}`}
            subheader={`${secondaryPrefix || ''} ${item[secondaryField] || ''} ${secondarySuffix || ''}`}
            avatar={<Avatar style={{backgroundColor: color}}>{<NodeIcon/>}</Avatar>}
          />
          <CardContent>
            {fields}
          </CardContent>
        </Card>
        <Visualization data={visualizationData} />
      </div>
    );
  }
}

export default ItemView;
