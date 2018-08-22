import React, { Component } from 'react';

import { has } from 'lodash-es';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';

import red from '@material-ui/core/colors/red';

import InputIcon from '@material-ui/icons/Input';
import ClearIcon from '@material-ui/icons/Clear';

import {
  TextField
} from 'redux-form-material-ui';
import { Field } from 'redux-form'

import googleLogo from './google.svg'
import girderLogo from './girder.png'

import './login.css';

class LoginButton extends Component {
  render = () => {
    return (
      <Button onClick={this.props.handleClick}>
        Log in
        <InputIcon className="r-icon-btn" />
      </Button>
    );
  }
}

class LoginOptions extends Component {
  render = () => {
    const {show, oauth, handleClose, handleGoogle, handleGirder} = this.props;

    const actions = [
      <Button key="cancel" color="primary" onClick={handleClose}>
        Cancel
      </Button>
    ]

    return (
      <Dialog
        aria-labelledby="login-dialog-title"
        open={show}
        onClose={handleClose}
      >
        <DialogTitle id="login-dialog-title">Login Provider</DialogTitle>
          <List>
            { oauth &&
            <ListItem button onClick={handleGoogle}>
              <ListItemText primary="Sign in with Google" />
              <ListItemIcon>
                <img className='oc-google' src={googleLogo} alt="google" />
              </ListItemIcon>
            </ListItem>
            }
            <ListItem button onClick={handleGirder}>
              <ListItemText primary="Sign in with Girder" />
              <ListItemIcon>
                <img className='oc-girder' src={girderLogo} alt="girder" />
              </ListItemIcon>
            </ListItem>
          </List>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    );
  }
}

const red500 = red['500'];

const style = {
  error: {
    color: red500
  }
}

class GirderLogin extends Component {

  render = () => {
    const {
      // redux-form
      error,
      handleSubmit,
      pristine,
      submitting,
      invalid,
      // other props
      show,
      handleClose,
      loginFn
    } = this.props;

    return (
      <Dialog
        aria-labelledby="girder-dialog-title"
        open={show}
        onClose={handleClose}
      >
        <DialogTitle id="girder-dialog-title">Sign in using Girder credentials</DialogTitle>
        <form onSubmit={handleSubmit(loginFn)} >
          <DialogContent>
            <div>
              <Field
                fullWidth
                name="username"
                component={TextField}
                placeholder="Username"
                label="Username"
              />
            </div>
            <div>
              <Field
                fullWidth
                name="password"
                component={TextField}
                placeholder="Password"
                label="Password"
                type="password"
              />
            </div>
            {error && <div style={style.error}>{has(error, 'message') ? error.message : error}</div>}
          </DialogContent>
          <DialogActions>
            <Button
              disabled={pristine || submitting || invalid}
              variant="contained"
              color="secondary"
              className="action-btn"
              type='submit'
            >
              <InputIcon className="l-icon-btn" />
              Login
            </Button>
            <Button
              disabled={submitting}
              variant="contained"
              color="secondary"
              className="action-btn"
              onClick={() => handleClose()}
            >
              <ClearIcon className="l-icon-btn" />
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

export { LoginButton, LoginOptions, GirderLogin };