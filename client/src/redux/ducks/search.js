import { createAction, handleActions } from 'redux-actions';

import { has, isNil } from 'lodash-es';
import produce from 'immer';

import { getNodes, parseUrl } from '../../nodes';

export const getGlobalMatches = (state) => state.search.global;
export const getCompositeMatches = (state) => {
  const platemapIds = new Set();
  return state.search.composite.results.filter(val => {
    if (platemapIds.has(val.platemap._id)) {
      return false;
    } else {
      platemapIds.add(val.platemap._id);
      return true;
    }
  })
};
export const getCompositePending = state => state.search.composite.pending;

// Actions

export const GLOBAL_SEARCH_REQUESTED = 'GLOBAL_SEARCH_REQUESTED';
export const GLOBAL_SEARCH_SUCCEEDED = 'GLOBAL_SEARCH_SUCCEEDED';
export const GLOBAL_SEARCH_FAILED = 'GLOBAL_SEARCH_FAILED';

export const COMPOSITE_SEARCH_REQUESTED = 'COMPOSITE_SEARCH_REQUESTED';
export const COMPOSITE_SEARCH_SUCCEEDED = 'COMPOSITE_SEARCH_SUCCEEDED';
export const COMPOSITE_SEARCH_FAILED = 'COMPOSITE_SEARCH_FAILED';

// Action creators

export const searchGlobal = createAction(GLOBAL_SEARCH_REQUESTED);
export const searchComposite = createAction(COMPOSITE_SEARCH_REQUESTED);

// Reducer

function patchItem(item) {
  const {path} = item;
  const NODES = getNodes();
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
  global: {
    root: {
      item: null,
      children: []
    }
  },
  composite: {
    results: [],
    pending: false,
    error: null

  }
};

const reducer = handleActions({
  [GLOBAL_SEARCH_REQUESTED]: (state, action) => {
    return {...state, global: initialState.global};
  },
  [GLOBAL_SEARCH_SUCCEEDED]: (state, action) => {
    const global = Object.entries(action.payload).reduce((result, pair) => {
      const [_id, value] = pair;
      let item = value['item'];
      if (!isNil(item)) {
        item = patchItem(item);
        value['item'] = item;
      }
      result[_id] = value;
      return result;
    }, {});
    return {...state, global};
  },
  [COMPOSITE_SEARCH_REQUESTED]: (state, action) => {
    return produce(state, draft => {
      draft.composite.pending = true;
      draft.composite.results = [];
    });
  },
  [COMPOSITE_SEARCH_SUCCEEDED]: (state, action) => {
    const results = action.payload;
    return produce(state, draft => {
      draft.composite.pending = false;
      draft.composite.results = results;
    });
  },
}, initialState);

export default reducer;

