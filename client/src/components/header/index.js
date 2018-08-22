import React, { Component } from 'react';

import { AppBar, Toolbar, Button } from '@material-ui/core';

import logo from '../../assets/logo.svg';

import Menu from '../../containers/header/menu';
import { LoginButtonContainer as LoginButton } from '../../containers/header/login';
// import { LoginButton } from '@openchemistry/girder-auth-ui';

class Header extends Component {
  render() {
    const { loggedIn, onLogoClick } = this.props;
    return (
      <AppBar color="default" position="static">
        <Toolbar>
          <Button color="inherit" aria-label="Logo" style={{marginRight: 9}}
            onClick={onLogoClick}
          >
            <img className='logo' src={logo} alt="logo" />
          </Button>
          <div style={{flex: 1}}>
          </div>
          { loggedIn ? <Menu/> : <LoginButton />}
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
