import React, { Component } from 'react';

import { connect } from 'react-redux';

import { reduxForm, SubmissionError } from 'redux-form';

import {
  LoginButton,
  LoginOptions,
  GirderLogin
} from '../../components/header/login';

import {
  showLoginOptions,
  showGirderLogin,
  getShowLoginOptions,
  getShowGirderLogin,
  isOauthEnabled,
  isAuthenticating,
  getOauthProviders,
  authenticate,
  usernameLogin
} from '@openchemistry/girder-auth-redux';

import { getAuthState } from '../../redux/ducks/auth';

// Login Button

class LoginButtonContainer extends Component {
  handleClick = (event) => {
    this.props.dispatch(showLoginOptions(true));
  };

  render = () => {
    return (
        <LoginButton handleClick={this.handleClick} />
    );
  }
}

function loginButtonMapStateToProps(state, ownProps) {
  return {};
}

LoginButtonContainer = connect(loginButtonMapStateToProps)(LoginButtonContainer)

// Login options popup
class LoginOptionsContainer extends Component {

  handleClose = () => {
    this.props.dispatch(showLoginOptions(false));
  };

  handleGoogle = () => {
    this.props.dispatch(showLoginOptions(false));
    this.props.dispatch(authenticate({token: null, redirect: true}));
  }

  handleGirder = () => {
    this.props.dispatch(showLoginOptions(false));
    this.props.dispatch(showGirderLogin(true));
  }

  render() {
    const { show } = this.props;
    
    if (!show) {
      return null;
    }

    return (
      <LoginOptions
        show={this.props.show}
        oauth={this.props.oauth}
        handleClose={this.handleClose}
        handleGoogle={this.handleGoogle}
        handleGirder={this.handleGirder}
      />
    );
  }
}

function loginOptionsMapStateToProps(state, ownProps) {
  const show = getShowLoginOptions(getAuthState(state));
  const oauth =  isOauthEnabled(getAuthState(state));

  return {
    show,
    oauth,
  }
}

LoginOptionsContainer = connect(loginOptionsMapStateToProps)(LoginOptionsContainer)

// Girder username/password login
const validate = values => {
  const errors = {}
  const requiredFields = [ 'username', 'password']
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = 'Required'
    }
  })

  return errors
}

class GirderLoginContainer extends Component {

  handleClose = () => {
    this.props.dispatch(showGirderLogin(false))
  };

  handleLogin = (values, dispatch) => {

    const { username, password } = values;
  
    let onSubmitPromise = new Promise((resolve, reject) => {
      dispatch(usernameLogin({username, password, resolve, reject}));
    })
    .then(val => {
      dispatch(showGirderLogin(false));
    })
    .catch(_error => {
      throw new SubmissionError({ _error });
    });

    return onSubmitPromise;
  }

  render = () => {
    const { show } = this.props;
    
    if (!show) {
      return null;
    }

    return (
      <GirderLogin
        handleClose={this.handleClose}
        loginFn={this.handleLogin}
        {...this.props}
      />
    );
  }
}

function girderLoginMapStateToProps(state, ownProps) {
  const show = getShowGirderLogin(getAuthState(state));
  return {
    show
  }
}

GirderLoginContainer = connect(girderLoginMapStateToProps)(GirderLoginContainer)
GirderLoginContainer = reduxForm({
  form: 'girderLogin',
  validate
})(GirderLoginContainer);

// Oauth redirect
class OauthRedirect extends Component {
  render = () => {
    const {providers, authenticating} = this.props;
    if (authenticating && providers && providers.Google) {
      window.location = providers.Google;
    }
    return null;
  }
}

function redirectMapStateToProps(state, ownProps) {
  const providers = getOauthProviders(getAuthState(state));
  const authenticating = isAuthenticating(getAuthState(state));
  return {
    providers,
    authenticating,
  }
}

OauthRedirect = connect(redirectMapStateToProps)(OauthRedirect)


export {
  LoginButtonContainer,
  LoginOptionsContainer,
  GirderLoginContainer,
  OauthRedirect
}
