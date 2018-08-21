import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import Cookies from 'universal-cookie';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import store from './redux/store';
import { fetchExperiments } from './redux/ducks/experiments';
import { fetchTests } from './redux/ducks/tests';

import { authenticate } from '@openchemistry/girder-auth-redux';

store.dispatch(fetchExperiments());
store.dispatch(fetchTests());

const cookies = new Cookies();
const cookieToken = cookies.get('girderToken');
// if there is no token the string "undefined" is returned ?!!
// if (!isNil(cookieToken)) {
if (cookieToken !== 'undefined') {
  store.dispatch(authenticate({token: cookieToken}));
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
