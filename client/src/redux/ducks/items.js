import { createAction, handleActions } from 'redux-actions';

import { has, isNil } from 'lodash-es';

import { NODES } from '../../utils/nodes';
// Selectors

export const getItems = (state, type) => {
  let items = {};
  for (let itemId in state.items) {
    if (state.items[itemId].type === type) {
      items[itemId] = state.items[itemId];
    }
  }
  return items;
};

export const getItem = (state, id) => state.items[id];

export const getChildren = (state, id, type) => {
  let children = {};
  const items = getItems(state, type);
  if (isNil(id)) {
    return items;
  }
  for (let itemId in items) {
    if (items[itemId].parentId === id) {
      children[itemId] = items[itemId];
    }
  }
  return children;
};

// Actions

export const CREATE_ITEM_REQUESTED = 'CREATE_ITEM_REQUESTED';
export const CREATE_ITEM_SUCCEEDED = 'CREATE_ITEM_SUCCEEDED';
export const CREATE_ITEM_FAILED = 'CREATE_ITEM_FAILED';

export const FETCH_ITEM_REQUESTED = 'FETCH_ITEM_REQUESTED';
export const FETCH_ITEM_SUCCEEDED = 'FETCH_ITEM_SUCCEEDED';
export const FETCH_ITEM_FAILED = 'FETCH_ITEM_FAILED';

export const UPDATE_ITEM_REQUESTED = 'UPDATE_ITEM_REQUESTED';
export const UPDATE_ITEM_SUCCEEDED = 'UPDATE_ITEM_SUCCEEDED';
export const UPDATE_ITEM_FAILED = 'UPDATE_ITEM_FAILED';

export const DELETE_ITEM_REQUESTED = 'DELETE_ITEM_REQUESTED';
export const DELETE_ITEM_SUCCEEDED = 'DELETE_ITEM_SUCCEEDED';
export const DELETE_ITEM_FAILED = 'DELETE_ITEM_FAILED';

export const FETCH_ITEMS_REQUESTED = 'FETCH_ITEMS_REQUESTED';
export const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
export const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';

// Action creators

export const createItem = createAction(CREATE_ITEM_REQUESTED);
export const fetchItem = createAction(FETCH_ITEM_REQUESTED);
export const updateItem = createAction(UPDATE_ITEM_REQUESTED);
export const deleteItem = createAction(DELETE_ITEM_REQUESTED);
export const fetchItems = createAction(FETCH_ITEMS_REQUESTED);

// Reducer

function patchItem(item, type) {
  item.parentId = null;
  item.type = type;
  if (!isNil(NODES[type].parentId) && has(item, NODES[type].parentId)) {
    item.parentId = item[NODES[type].parentId];
  }
  return item;
}

const initialState = {};

const reducer = handleActions({
  [CREATE_ITEM_SUCCEEDED]: (state, action) => {
    let { item, itemType } = action.payload;
    item = patchItem(item, itemType);
    return {...state, [item._id]: item};
  },
  [FETCH_ITEM_SUCCEEDED]: (state, action) => {
    let { item, itemType } = action.payload;
    item = patchItem(item, itemType);
    return {...state, [item._id]: item};
  },
  [UPDATE_ITEM_SUCCEEDED]: (state, action) => {
    let { item, itemType } = action.payload;
    item = patchItem(item, itemType);
    return {...state, [item._id]: item};
  },
  [FETCH_ITEMS_SUCCEEDED]: (state, action) => {
    let items = {...state};
    let { itemType } = action.payload;
    return action.payload.items.reduce((result, item) => {
      item = patchItem(item, itemType);
      result[item._id] = item;
      return result;
    }, items);
  },
  [DELETE_ITEM_SUCCEEDED]: (state, action) => {
    let newState = {...state};
    delete newState[action.payload.id];
    return newState;
  },
}, initialState);

export default reducer;
