import React, { Component } from 'react';
import { reduxForm, getFormValues } from 'redux-form';

import { connect } from 'react-redux';

import { replace } from 'connected-react-router';
import { isNil } from 'lodash-es';

import { getItem, fetchItem, createItem, updateItem } from '../redux/ducks/items';

import ItemEdit from '../components/itemEdit';
import NotFoundPage from '../components/notFound.js';

import { createFieldsFactory } from '../utils/fields';
import { NODES, ROOT_NODE, makeUrl, parseUrlMatch } from '../utils/nodes';

class ItemEditContainer extends Component {

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
    const { ancestors, item, create, dispatch } = this.props;
    if (!create) {
      if (item.type !== ROOT_NODE) {
        dispatch(fetchItem({ancestors, item}));
      }
    }
  }

  onSubmit = (values) => {
    const { ancestors, item, create, dispatch } = this.props;
    const actionCreator = create ? createItem : updateItem;
    values.type = item.type;
    if (NODES[item.type].parentId) {
      values[NODES[item.type].parentId] = ancestors[ancestors.length - 1]._id;
    }

    for (let fileField of NODES[item.type].fileFields || []) {
      if (values[fileField] && values[fileField][0]) {
        values[fileField] = values[fileField][0].name;
      }
    }

    let onSubmitPromise = new Promise((resolve, reject) => {
      dispatch(actionCreator({ancestors, item: values, resolve, reject}));
    })
    .then((val) => {
      values._id = val._id;
      const url = makeUrl(ancestors, values);
      this.props.dispatch(replace(url));
    })
    .catch((err) =>{
    });

    return onSubmitPromise;
  }
  
  render() {
    const { item, create } = this.props;
    
    if (!create && isNil(item.fields)) {
      return <NotFoundPage />;
    }
    
    return (
      <ItemEdit
        {...this.props}
        itemName={NODES[item.type].label}
        fieldsCreator={createFieldsFactory(item.type)}
        onSubmit={this.onSubmit}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const create = ownProps.match.params.action === 'add';
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

  return {
    create,
    ancestors,
    item,
    initialValues: item.fields,
    currentValues: getFormValues('itemEdit')(state)
  };
}

ItemEditContainer = reduxForm({
  form: 'itemEdit',
  enableReinitialize: true
})(ItemEditContainer);

ItemEditContainer = connect(mapStateToProps)(ItemEditContainer);

export default ItemEditContainer;
