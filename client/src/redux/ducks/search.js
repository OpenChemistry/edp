import { createAction, handleActions } from 'redux-actions';

import { has, isNil } from 'lodash-es';

import { NODES, parseUrl } from '../../utils/nodes';

export const getMatches = (state) => state.search;

// Actions

export const GLOBAL_SEARCH_REQUESTED = 'GLOBAL_SEARCH_REQUESTED';
export const GLOBAL_SEARCH_SUCCEEDED = 'GLOBAL_SEARCH_SUCCEEDED';
export const GLOBAL_SEARCH_FAILED = 'GLOBAL_SEARCH_FAILED';

// Action creators

export const seatchGlobal = createAction(GLOBAL_SEARCH_REQUESTED);

// Reducer

function patchItem(item) {
  const {path} = item;
  const ancestors = parseUrl(path);
  const item_ = ancestors.pop();
  const {type} = item_;

  item.parentId = null;
  item.type = type;
  if (!isNil(NODES[type].parentId) && has(item, NODES[type].parentId)) {
    item.parentId = item[NODES[type].parentId];
  }
  return item;
}

const initialState = {
  root: {
    item: null,
    children: []
  }
};

const reducer = handleActions({
  [GLOBAL_SEARCH_REQUESTED]: (state, action) => {
    return {...initialState};
  },
  [GLOBAL_SEARCH_SUCCEEDED]: (state, action) => {
    return Object.entries(action.payload).reduce((result, pair) => {
      const [_id, value] = pair;
      let item = value['item'];
      if (!isNil(item)) {
        item = patchItem(item);
        value['item'] = item;
      }
      result[_id] = value;
      return result;
    }, {});
  },
}, initialState);

export default reducer;

