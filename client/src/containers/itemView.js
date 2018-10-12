import React, { Component } from 'react';

import { connect } from 'react-redux';

import { push } from 'connected-react-router';
import { isNil } from 'lodash-es';

import { getItem, fetchItem, fetchItems, deleteItem, getChildren } from '../redux/ducks/items';

import ItemView from '../components/itemView';
import ItemList from '../components/itemList';
import NotFoundPage from '../components/notFound.js';

import { createFieldsFactory } from '../utils/fields';
import { NODES, ROOT_NODE, makeUrl, parseUrlMatch } from '../utils/nodes';

class ItemViewContainer extends Component {

  componentDidMount() {
    this.requestItems();
  }

  componentDidUpdate(prevProps) {
    const prevItem = prevProps.item;
    const item = this.props.item;
    if (prevItem._id !== item._id) {
      this.requestItems();
    }
  }

  requestItems() {
    const { ancestors, item, children, dispatch } = this.props;

    if (item.type !== ROOT_NODE) {
      dispatch(fetchItem({ancestors, item}));
    }

    const ancestors_ = ancestors.concat(item);
    for (let child of children) {
      dispatch(fetchItems({ancestors: ancestors_, item: child}));
    }
  }

  onEditItem = () => {
    const { ancestors, item, dispatch } = this.props;
    const url = `${makeUrl(ancestors, item)}/edit`;
    dispatch(push(url));
  }

  onOpenChild = (child) => {
    const { ancestors, item, dispatch } = this.props;
    const url = `${makeUrl(ancestors.concat(item), child)}`;
    dispatch(push(url));
  }

  onAddChild = (childType) => {
    const { ancestors, item, dispatch } = this.props;
    const url = `${makeUrl(ancestors, item)}/${NODES[childType].url}/add`;
    dispatch(push(url));
  }

  onDeleteChild = (child) => {
    const { ancestors, item, dispatch } = this.props;
    dispatch(deleteItem({ancestors: ancestors.concat(item), item: child}));
  }
  
  render() {
    const { item, children } = this.props;
    
    if (item.type !== ROOT_NODE && isNil(item.fields)) {
      return <NotFoundPage />;
    }
    
    const childrenLists = [];
    for (let child of children) {
      childrenLists.push(
        <ItemList
          key={child.type}
          showDelete
          items={child.items}
          title={NODES[child.type].labelPlural}
          primaryField={NODES[child.type].primaryField}
          secondaryField={NODES[child.type].secondaryField}
          primaryPrefix={NODES[child.type].primaryPrefix}
          primarySuffix={NODES[child.type].primarySuffix}
          secondaryPrefix={NODES[child.type].secondaryPrefix}
          secondarySuffix={NODES[child.type].secondarySuffix}
          color={NODES[child.type].color}
          icon={NODES[child.type].icon}
          onOpen={this.onOpenChild}
          onAdd={() => {this.onAddChild(child.type)}}
          onDelete={this.onDeleteChild}
        />
      );
    }

    return (
      <div>
        {!isNil(item.fields) &&
        <ItemView
          item={item.fields}
          onEdit={this.onEditItem}
          fieldsCreator={createFieldsFactory(item.type)}
          primaryField={NODES[item.type].primaryField}
          secondaryField={NODES[item.type].secondaryField}
          primaryPrefix={NODES[item.type].primaryPrefix}
          primarySuffix={NODES[item.type].primarySuffix}
          secondaryPrefix={NODES[item.type].secondaryPrefix}
          secondarySuffix={NODES[item.type].secondarySuffix}
          color={NODES[item.type].color}
          icon={NODES[item.type].icon}
        />
        }
        {childrenLists}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  let ancestors = parseUrlMatch(ownProps.match);
  let item;
  if (ancestors.length === 0) {
    item = {
      url: null,
      _id: null,
      type: ROOT_NODE,
      fields: null
    }
  } else {
    item = ancestors.pop();
    item.fields = getItem(state, item._id);
  }

  let children = [];
  for (let childType of NODES[item.type].children) {
    let items = getChildren(state, item._id, childType);
    children.push(
      {
        type: childType,
        items
      }
    );
  }

  return {
    ancestors,
    item,
    children
  };
}

export default connect(mapStateToProps)(ItemViewContainer);
