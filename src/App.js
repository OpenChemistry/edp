import React, { Component } from 'react';
import logo from './assets/logo.svg';
import './App.css';

import { AppBar, Toolbar, Button } from '@material-ui/core';

import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'

import CssBaseline from '@material-ui/core/CssBaseline';

import { history } from './redux/store';
import ExperimentList from './containers/experimentList';
import ExperimentView from './containers/experimentView';
import ExperimentEdit from './containers/experimentEdit';
import TestView from './containers/testView';
import TestEdit from './containers/testEdit';
import TestList from './containers/testList';

import { EXPERIMENT_LIST_ROUTE, EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE } from './routes';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline />
        <AppBar color="default" position="fixed">
          <Toolbar>
            <Button color="inherit" aria-label="Logo" style={{marginRight: 9}}>
              <img className='logo' src={logo} alt="logo" />
            </Button>
          </Toolbar>
        </AppBar>
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
          <br/>
          <p>
            Test below
          </p>
          <TestList/>
        </div>
      </div>
    );
  }
}

export default App;
