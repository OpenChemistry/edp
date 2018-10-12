import React, { Component } from 'react';

import { isNil } from 'lodash-es';

import {
  List,
  ListItem,
  Paper,
  Typography
} from '@material-ui/core';

import { NODES } from '../../utils/nodes';
import ItemListItem from '../itemList/item';

class SearchResults extends Component {

  _buildTree(matches, rootId, indent=-1) {
    const {onOpen} = this.props;
    const children = [];
    const isLeaf = matches[rootId]['children'] ? matches[rootId]['children'].length === 0 : true;
    for (let child of matches[rootId]['children']) {
      children.push(this._buildTree(matches, child, indent + 1));
    }
    let item = matches[rootId]['item'];
    const itemStyle = {};
    let padding = '2rem';
    if (indent < 1) {
      padding = 0;
    }
    itemStyle['marginBottom'] = '0.5rem';
    // Highlight leaf nodes, i.e. the nodes that actually matched the query
    if (isLeaf) {
      if (!isNil(item)) {
        itemStyle['boxShadow'] = `0 0.1rem 0.25rem ${NODES[item.type].color}`
      }
    }
    return (
      <div key={rootId} style={{paddingLeft: padding}}>
        {!isNil(item) &&
        <Paper style={itemStyle}>
          <ItemListItem
            item={item}
            showLabel
            onOpen={onOpen}
            primaryField={NODES[item.type].primaryField}
            secondaryField={NODES[item.type].secondaryField}
            primaryPrefix={NODES[item.type].primaryPrefix}
            primarySuffix={NODES[item.type].primarySuffix}
            secondaryPrefix={NODES[item.type].secondaryPrefix}
            secondarySuffix={NODES[item.type].secondarySuffix}
            color={isLeaf ? NODES[item.type].color : null}
            icon={NODES[item.type].icon}
            label={NODES[item.type].label}
          />
        </Paper>
        }
          {children}
      </div>
    );
  }

  render() {
    const {matches} = this.props;
    let matchItems;

    if (!isNil(matches)) {
      matchItems = this._buildTree(matches, 'root');
    }

    return (
      <div>
        <List >
          <div style={{paddingBottom: '0.5rem'}}>
            <ListItem>
              <Typography variant='title'>
                Matches
              </Typography>
            </ListItem>
          </div>
          {matchItems}
        </List>
      </div>
    );
  }
}

export default SearchResults;
