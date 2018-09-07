import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import Cookies from 'universal-cookie';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import store from './redux/store';

import { auth } from '@openchemistry/girder-redux';

const cookies = new Cookies();
const cookieToken = cookies.get('girderToken');
// if there is no token the string "undefined" is returned ?!!
// if (!isNil(cookieToken)) {
if (cookieToken !== 'undefined') {
  store.dispatch(auth.actions.authenticate({token: cookieToken}));
}

// Test if oauth is enabled on the backend
store.dispatch(auth.actions.testOauthEnabled());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
