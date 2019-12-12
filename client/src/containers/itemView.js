import React, { Component } from 'react';

import { connect } from 'react-redux';

import { push, replace } from 'connected-react-router';
import { isNil } from 'lodash-es';

import { auth } from '@openchemistry/girder-redux';

import { getItem, fetchItem, fetchItems, deleteItem, getChildren } from '../redux/ducks/items';

import ItemView from '../components/itemView';
import ItemList from '../components/itemList';
import NotFoundPage from '../components/notFound.js';

import { getNodes, makeUrl, parseUrlMatch, createFieldsFactory, redirectItemView } from '../nodes';
import { ROOT_NODE } from '../nodes/root';

import { hasAdminAccess } from '../utils/permissions';
import { getServerSettings } from '../redux/ducks/settings';

class ItemViewContainer extends Component {

  componentDidMount() {
    this.requestItems();
    this.redirect();
  }

  componentDidUpdate(prevProps) {
    const prevItem = prevProps.item;
    const prevDeployment = prevProps.deployment;
    const { item, deployment } = this.props;
    if (prevItem._id !== item._id || prevDeployment !== deployment) {
      this.requestItems();
    }

    this.redirect();
  }

  requestItems() {
    const { ancestors, item, children, dispatch, deployment } = this.props;

    if (isNil(deployment)) {
      return;
    }

    if (item.type !== ROOT_NODE) {
      dispatch(fetchItem({ancestors, item}));
    }

    const ancestors_ = ancestors.concat(item);
    for (let child of children) {
      dispatch(fetchItems({ancestors: ancestors_, item: child}));
    }
  }

  redirect() {
    const { ancestors, item, children, dispatch } = this.props;
    if (redirectItemView(item.type) && children.length > 0 &&
        Object.keys(children[0].items || {}).length > 0) {
      const child = children[0].items[Object.keys(children[0].items)[0]];
      const url = `${makeUrl(ancestors.concat(item), child)}`;
      dispatch(replace(url));
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
    const NODES = getNodes();
    const url = `${makeUrl(ancestors, item)}/${NODES[childType].url}/add`;
    dispatch(push(url));
  }

  onDeleteChild = (child) => {
    const { ancestors, item, dispatch } = this.props;
    dispatch(deleteItem({ancestors: ancestors.concat(item), item: child}));
  }
  
  render() {
    const { ancestors, item, children, me, location } = this.props;
    const NODES = getNodes();
    
    if (item.type !== ROOT_NODE && isNil(item.fields)) {
      return <NotFoundPage />;
    }

    if (redirectItemView(item.type)) {
      return null;
    }

    let canEdit = false;
    if (!isNil(me)) {
      if (item.type === ROOT_NODE || hasAdminAccess(me, item.fields)) {
        canEdit = true;
      }
    }

    const viewComponent = NODES[item.type].viewComponent ? React.createElement(
      NODES[item.type].viewComponent,
      {item, ancestors, location, canEdit}
    ) :  null;

    const childrenLists = [];
    for (let child of children) {
      let ingestComponent;
      if (!isNil(NODES[child.type].ingest)) {
        ingestComponent = React.createElement(
          NODES[child.type].ingest,
          {ancestors: [...ancestors, item]}
        );
      }
      childrenLists.push(
        <ItemList
          key={child.type}
          canEdit={canEdit}
          items={child.items}
          title={NODES[child.type].labelPlural}
          primaryField={NODES[child.type].primaryField}
          secondaryField={NODES[child.type].secondaryField}
          primaryPrefix={NODES[child.type].primaryPrefix}
          primarySuffix={NODES[child.type].primarySuffix}
          secondaryPrefix={NODES[child.type].secondaryPrefix}
          secondarySuffix={NODES[child.type].secondarySuffix}
          sortFn={NODES[child.type].sortFn}
          ingestComponent={ingestComponent}
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
          canEdit={canEdit}
          item={item.fields}
          onEdit={this.onEditItem}
          fieldsCreator={createFieldsFactory(item.type)}
          primaryField={NODES[item.type].primaryField}
          secondaryField={NODES[item.type].secondaryField}
          primaryPrefix={NODES[item.type].primaryPrefix}
          primarySuffix={NODES[item.type].primarySuffix}
          secondaryPrefix={NODES[item.type].secondaryPrefix}
          secondarySuffix={NODES[item.type].secondarySuffix}
          visualizationField={NODES[item.type].visualizationField}
          color={NODES[item.type].color}
          icon={NODES[item.type].icon}
        />
        }
        {childrenLists}
        {viewComponent}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  let ancestors = parseUrlMatch(ownProps.match);
  const { deployment } = getServerSettings(state);
  const NODES = getNodes();
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
  let childTypes = NODES[item.type] ? NODES[item.type].children : [];
  for (let childType of childTypes) {
    let items = getChildren(state, item._id, childType);
    children.push(
      {
        type: childType,
        items
      }
    );
  }

  const me = auth.selectors.getMe(state);

  return {
    deployment,
    ancestors,
    item,
    children,
    me
  };
}

export default connect(mapStateToProps)(ItemViewContainer);
