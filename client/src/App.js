import React, { Component } from 'react';

import './App.css';

import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import { history } from './redux/store';
import PrivateRoute from './containers/privateRoute';
import PublicRoute from './containers/publicRoute';

import Header from './containers/header/';
import BreadCrumb from './containers/breadcrumb';

import { auth as authUI } from '@openchemistry/girder-ui';

import { ROOT_ROUTE } from './routes';
import ItemView from './containers/itemView';
import ItemEdit from './containers/itemEdit';
import SearchContainer from './containers/search';
import CompositeSamplesView from './containers/composite-samples/connected-view';
import CompositeSamplesLearning from './containers/composite-samples/connected-active-learning';

import MultidimensionContainer from './containers/composite-samples/8d-view';
import MultidimensionLearningContainer from './containers/composite-samples/8d-active-learning';

import Footer from './containers/footer';
import Head from './containers/head';
import { getDarkMode } from './redux/ducks/theme';
import { getServerSettings }  from './redux/ducks/settings';

import { isEmpty, isNil } from 'lodash-es';

const appStyles = theme => ({
  root: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flexGrow:1,
    position: 'relative',
    width: '100%',
    maxWidth: '70rem',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: '0.5rem'
  },
  footer: {

  }
});

const lightTheme = createMuiTheme();

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

class App extends Component {
  render() {
    let development = false;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      development = true;
    }
    const {classes, darkMode, title} = this.props;
    document.title = title;

    return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <div className={classes.root}>
          <Head />
          <CssBaseline />
          <Header />
          <ConnectedRouter history={history}>
            <div className={classes.content}>
              <BreadCrumb/>
              <Switch>
                <PrivateRoute path={'/:url0/:action(add)'} exact component={ItemEdit} />
                <PrivateRoute path={'/:url0/:id0/:action(edit)'} exact component={ItemEdit} />
                <PublicRoute path={'/:url0/:id0'} exact component={ItemView} />

                <PrivateRoute path={'/:url0/:id0/:url1/:action(add)'} exact component={ItemEdit} />
                <PrivateRoute path={'/:url0/:id0/:url1/:id1/:action(edit)'} exact component={ItemEdit} />
                <PublicRoute path={'/:url0/:id0/:url1/:id1/:action(samples)'} exact component={CompositeSamplesView} />
                <PublicRoute path={'/:url0/:id0/:url1/:id1/:action(learning)'} exact component={CompositeSamplesLearning} />
                <PublicRoute path={'/:url0/:id0/:url1/:id1'} exact component={ItemView} />

                <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:action(add)'} exact component={ItemEdit} />
                <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2/:action(edit)'} exact component={ItemEdit} />
                <PublicRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2'} exact component={ItemView} />

                <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2/:url3/:action(add)'} exact component={ItemEdit} />
                <PrivateRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2/:url3/:id3/:action(edit)'} exact component={ItemEdit} />
                <PublicRoute path={'/:url0/:id0/:url1/:id1/:url2/:id2/:url3/:id3'} exact component={ItemView} />

                <PublicRoute path={'/search'} exact component={SearchContainer} />

                <PublicRoute path={'/multidimension'} exact component={MultidimensionContainer} />
                <PublicRoute path={'/multidimension-learning'} exact component={MultidimensionLearningContainer} />

                <PublicRoute path={ROOT_ROUTE} exact component={ItemView} />
              </Switch>
            </div>
          </ConnectedRouter>
          <div className={classes.footer}>
            <Footer />
          </div>
          <authUI.LoginOptions girder={development}/>
          <authUI.GirderLogin/>
          <authUI.OauthRedirect/>
        </div>
      </ThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  const darkMode = getDarkMode(state);
  const settings = getServerSettings(state);
  let title = '';

  // We want the title to be '' until the settings have been fetch, then we
  // can decide what todo
  if (!isEmpty(settings)) {
    if (!isNil(settings.title)) {
      title = settings.title;
    }
    else {
      title = 'Experimental Data Platform'
    }
  }

  return {darkMode, title};
}

App = withStyles(appStyles)(App);
App = connect(mapStateToProps)(App);

export default App;
