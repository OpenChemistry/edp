import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import Cookies from 'universal-cookie';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import store from './redux/store';
import { fetchExperiments } from './redux/ducks/experiments';

import { authenticate, testOauthEnabled } from '@openchemistry/girder-auth-redux';

const cookies = new Cookies();
const cookieToken = cookies.get('girderToken');
// if there is no token the string "undefined" is returned ?!!
// if (!isNil(cookieToken)) {
if (cookieToken !== 'undefined') {
  store.dispatch(authenticate({token: cookieToken}));
}

setTimeout(()=>{
  store.dispatch(fetchExperiments());
}, 1000);

// Test if oauth is enabled on the backend
store.dispatch(testOauthEnabled());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
