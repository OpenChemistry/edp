import { call, put, select, all, takeEvery } from 'redux-saga/effects';
import { isNil } from 'lodash-es';

import {
  CREATE_ITEM_REQUESTED, CREATE_ITEM_SUCCEEDED, CREATE_ITEM_FAILED,
  FETCH_ITEM_REQUESTED, FETCH_ITEM_SUCCEEDED, FETCH_ITEM_FAILED,
  UPDATE_ITEM_REQUESTED, UPDATE_ITEM_SUCCEEDED, UPDATE_ITEM_FAILED,
  DELETE_ITEM_REQUESTED, DELETE_ITEM_SUCCEEDED, DELETE_ITEM_FAILED,
  FETCH_ITEMS_REQUESTED, FETCH_ITEMS_SUCCEEDED, FETCH_ITEMS_FAILED,
} from '../ducks/items';

import {
  getItems as getItemsRest,
  getItem as getItemRest,
  createItem as createItemRest,
  updateItem as updateItemRest,
  deleteItem as deleteItemRest
} from '../../rest/items';

import {
  getRootFolder,
} from '../ducks/files';

import {
  fetchRootFolder,
  uploadFile
} from '../sagas/files';

import { NODES } from '../../utils/nodes';

// Upload item files
function* uploadItemFiles(item) {
  if (isNil(NODES[item.type].fileFields)) {
    return;
  }

  let rootFolder = yield select(getRootFolder);
  if (isNil(rootFolder)) {
    rootFolder = yield call(fetchRootFolder);
  }

  const filesToUpload = {};

  for (let fileField of NODES[item.type].fileFields) {
    if (!isNil(item[fileField])) {
      filesToUpload[`${fileField}Model`] = call(uploadFile, item[fileField], rootFolder['_id'], item[`${fileField}Id`]);
    }
  }

  const responses = yield all(filesToUpload);

  for (let fileField of NODES[item.type].fileFields) {
    delete item[fileField];
    if (!isNil(responses[`${fileField}Model`])) {
      item[`${fileField}Id`] = responses[`${fileField}Model`]['_id'];
    }
  }
}

// Create item

function* onCreateItem(action) {
  const { ancestors, item, resolve, reject } = action.payload;
  try {
    yield uploadItemFiles(item);
    const newItem = yield call(createItemRest, ancestors, item);
    yield put({type: CREATE_ITEM_SUCCEEDED, payload: {item: newItem, itemType: item.type}});
    resolve(newItem);
  } catch (e) {
    yield put({type: CREATE_ITEM_FAILED, error: e});
    reject(e);
  }
}

export function* createItemSaga() {
  yield takeEvery(CREATE_ITEM_REQUESTED, onCreateItem);
}

// Fetch item

function* onFetchItem(action) {
  try {
    const { ancestors, item } = action.payload;
    const newItem = yield call(getItemRest, ancestors, item);
    yield put({type: FETCH_ITEM_SUCCEEDED, payload: { item: newItem, itemType: item.type }});
  } catch (e) {
    yield put({type: FETCH_ITEM_FAILED, error: e});
  }
}

export function* fetchItemSaga() {
  yield takeEvery(FETCH_ITEM_REQUESTED, onFetchItem);
}

// Update item

function* onUpdateItem(action) {
  const { ancestors, item, resolve, reject } = action.payload;
  try {
    yield uploadItemFiles(item);
    const newItem = yield call(updateItemRest, ancestors, item);
    yield put({type: UPDATE_ITEM_SUCCEEDED, payload: { item: newItem, itemType: item.type }});
    resolve(newItem);
  } catch (e) {
    yield put({type: UPDATE_ITEM_FAILED, error: e});
    reject(e);
  }
}

export function* updateItemSaga() {
  yield takeEvery(UPDATE_ITEM_REQUESTED, onUpdateItem);
}

// Delete item

function* onDeleteItem(action) {
  try {
    const { ancestors, item } = action.payload;
    yield call(deleteItemRest, ancestors, item);
    yield put({type: DELETE_ITEM_SUCCEEDED, payload: {id: item._id}});
  } catch (e) {
    yield put({type: DELETE_ITEM_FAILED, error: e});
  }
}

export function* deleteItemSaga() {
  yield takeEvery(DELETE_ITEM_REQUESTED, onDeleteItem);
}


// Fetch all items given ancestors

function* onFetchItems(action) {
  try {
    const { ancestors, item } = action.payload;
    const items = yield call(getItemsRest, ancestors, item);
    yield put({type: FETCH_ITEMS_SUCCEEDED, payload: {items, itemType: item.type}});
  } catch (e) {
    yield put({type: FETCH_ITEMS_FAILED, error: e});
  }
}

export function* fetchItemsSaga() {
  yield takeEvery(FETCH_ITEMS_REQUESTED, onFetchItems);
}
