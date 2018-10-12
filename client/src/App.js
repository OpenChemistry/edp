import React, { Component } from 'react';

import './App.css';

import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'

import CssBaseline from '@material-ui/core/CssBaseline';

import { history } from './redux/store';
import PrivateRoute from './containers/privateRoute';

import Header from './containers/header/';
import BreadCrumb from './containers/breadcrumb';

import { auth as authUI } from '@openchemistry/girder-ui';

import { ROOT_ROUTE } from './routes';
import ItemView from './containers/itemView';
import ItemEdit from './containers/itemEdit';
import SearchContainer from './containers/search';

class App extends Component {
  render() {
    let development = false;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      development = true;
    }
    return (
      <div className="App">
        <CssBaseline />
        <Header />
        <ConnectedRouter history={history}>
          <div className="content">
            <BreadCrumb/>
            <Switch>
              <PrivateRoute path={'/:url0/:action(add)'} exact component={ItemEdit} />
              <PrivateRoute path={'/:url0/:id0/:action(edit)'} exact component={ItemEdit} />
              <PrivateRoute path={'/:url0/:id0'} exact component={ItemView} />

              <PrivateRoute path={'/:url0/:id0/:url1/:action(add)'} exact component={ItemEdit} />
              <PrivateRoute path={'/:url0/:id0/:url1/:id1/:action(edit)'} exact component={ItemEdit} />
              <PrivateRoute path={'/:url0/:id0/:url1/:id1'} exact component={ItemView} />

              <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:action(add)'} exact component={ItemEdit} />
              <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2/:action(edit)'} exact component={ItemEdit} />
              <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2'} exact component={ItemView} />

              <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2/:url3/:action(add)'} exact component={ItemEdit} />
              <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2/:url3/:id3/:action(edit)'} exact component={ItemEdit} />
              <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2/:url3/:id3'} exact component={ItemView} />

              <PrivateRoute path={'/search'} exact component={SearchContainer} />

              <PrivateRoute path={ROOT_ROUTE} exact component={ItemView} />
            </Switch>
          </div>
        </ConnectedRouter>
        <authUI.LoginOptions girder={development}/>
        <authUI.GirderLogin/>
        <authUI.OauthRedirect/>
      </div>
    );
  }
}

export default App;
