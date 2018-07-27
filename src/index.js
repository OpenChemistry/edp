import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import store from './redux/store';

// import { createExperiment } from './redux/ducks/experiments';

// for (let i = 0; i < 5; ++i) {
//   let exp = {
//     text: 'Lulzi ' + i.toString()
//   }
//   store.dispatch(createExperiment(exp));
// }



// store.dispatch(createExperiment(exp));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
