import React, { Component } from 'react';

import './App.css';

import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'

import CssBaseline from '@material-ui/core/CssBaseline';

import { history } from './redux/store';
import ExperimentList from './containers/experimentList';
import ExperimentView from './containers/experimentView';
import ExperimentEdit from './containers/experimentEdit';
import TestView from './containers/testView';
import TestEdit from './containers/testEdit';
import Header from './containers/header';

import { EXPERIMENT_LIST_ROUTE, EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE } from './routes';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline />
        <Header />
        <div className="content">
          <ConnectedRouter history={history}>
            <Switch>
              <Route path={EXPERIMENT_LIST_ROUTE} exact component={ExperimentList} />
              <Route path={`${EXPERIMENT_VIEW_ROUTE}/:action(add)`} exact component={ExperimentEdit} />
              <Route path={`${EXPERIMENT_VIEW_ROUTE}/:id/:action(edit)`} exact component={ExperimentEdit} />
              <Route path={`${EXPERIMENT_VIEW_ROUTE}/:id`} exact component={ExperimentView} />
              <Route path={`${EXPERIMENT_VIEW_ROUTE}/:id/:action(addtest)`} exact component={TestEdit} />
              <Route path={`${TEST_VIEW_ROUTE}/:id/:action(edit)`} exact component={TestEdit} />
              <Route path={`${TEST_VIEW_ROUTE}/:id`} exact component={TestView} />
            </Switch>
          </ConnectedRouter>
        </div>
      </div>
    );
  }
}

export default App;
