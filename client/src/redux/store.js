import { combineReducers, applyMiddleware, createStore } from 'redux';
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { reducer as formReducer } from 'redux-form'
import loggerMiddleware from 'redux-logger';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas';

import * as reducers from './ducks';

import { default as girderAuthReducer } from './ducks/auth';

export const history = createBrowserHistory({basename: process.env.PUBLIC_URL});

const rootReducer = connectRouter(history)(combineReducers({
  ...reducers,
  auth: girderAuthReducer,
  form: formReducer
}));

const sagaMiddleware = createSagaMiddleware();
let middlewares = [];
middlewares.push(sagaMiddleware);
middlewares.push(routerMiddleware(history));
middlewares.push(loggerMiddleware);

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

sagaMiddleware.run(rootSaga);

export default store;
