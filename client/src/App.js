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
import Header from './containers/header/';
import BreadCrumb from './containers/breadcrumb';
import {
  LoginOptionsContainer as LoginOptions,
  GirderLoginContainer as GirderLogin,
  OauthRedirect
} from './containers/header/login';

import { EXPERIMENT_LIST_ROUTE, EXPERIMENT_VIEW_ROUTE, TEST_VIEW_ROUTE } from './routes';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline />
        <Header />
        <ConnectedRouter history={history}>
          <div className="content">
            <BreadCrumb/>
            <Switch>
              <Route path={EXPERIMENT_LIST_ROUTE} exact component={ExperimentList} />
              <Route path={`/${EXPERIMENT_VIEW_ROUTE}/:action(add)`} exact component={ExperimentEdit} />
              <Route path={`/${EXPERIMENT_VIEW_ROUTE}/:experimentId/:action(edit)`} exact component={ExperimentEdit} />
              <Route path={`/${EXPERIMENT_VIEW_ROUTE}/:experimentId`} exact component={ExperimentView} />
              <Route path={`/${EXPERIMENT_VIEW_ROUTE}/:experimentId/:action(addtest)`} exact component={TestEdit} />
              <Route path={`/${EXPERIMENT_VIEW_ROUTE}/:experimentId/${TEST_VIEW_ROUTE}/:testId/:action(edit)`} exact component={TestEdit} />
              <Route path={`/${EXPERIMENT_VIEW_ROUTE}/:experimentId/${TEST_VIEW_ROUTE}/:testId`} exact component={TestView} />
            </Switch>
          </div>
        </ConnectedRouter>
        <LoginOptions/>
        <GirderLogin/>
        <OauthRedirect/>
      </div>
    );
  }
}

export default App;
