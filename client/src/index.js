import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Cookies from 'universal-cookie';
import { isNil } from 'lodash-es';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import store from './redux/store';

import { auth } from '@openchemistry/girder-redux';
import girderClient from '@openchemistry/girder-client';

import { fetchServerSettings } from './redux/ducks/settings';
import { history } from './redux/store';

const cookies = new Cookies();
const cookieToken = cookies.get('girderToken');

let path = window.location.hash.slice(1);
if (path) {
  window.location.hash = '';
  history.replace(`/${path}`);
}

// Set the prefix for API calls if we have one
girderClient().setPrefix(window.PUBLIC_URL);
// If we have been provided with an API URL, use that as the base URL.
if (!isNil(window.API_URL) && !window.API_URL.startsWith('%')) {
  girderClient().setBaseURL(window.API_URL);
}

// if there is no token the string "undefined" is returned ?!!
// if (!isNil(cookieToken)) {
if (cookieToken !== 'undefined') {
  store.dispatch(auth.actions.authenticate({token: cookieToken}));
}

// Test if oauth is enabled on the backend
store.dispatch(auth.actions.testOauthEnabled());

// Get server side configuration, to build the node hierarchy
store.dispatch(fetchServerSettings());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();


