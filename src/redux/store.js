import { combineReducers, applyMiddleware, createStore } from 'redux';
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { reducer as formReducer } from 'redux-form'
import loggerMiddleware from 'redux-logger';
import createSagaMiddleware from 'redux-saga'
import { createExperimentSaga } from './sagas/experiments';

import * as reducers from './ducks';

export const history = createBrowserHistory()

const rootReducer = connectRouter(history)(combineReducers({...reducers, form: formReducer}));
const sagaMiddleware = createSagaMiddleware();
let middlewares = [];
middlewares.push(sagaMiddleware);
middlewares.push(routerMiddleware(history));
middlewares.push(loggerMiddleware);

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

sagaMiddleware.run(createExperimentSaga);

export default store;
