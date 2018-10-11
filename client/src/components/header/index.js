import React, { Component } from 'react';

import { AppBar, Toolbar, Button, IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import logo from '../../assets/logo.svg';

import { auth as authUI} from '@openchemistry/girder-ui';

class Header extends Component {
  render() {
    const { loggedIn, onLogoClick, onSearchClick } = this.props;
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
          { loggedIn ? <IconButton onClick={onSearchClick}><Search/></IconButton> : null}
          { loggedIn ? <authUI.UserMenu/> : <authUI.LoginButton />}
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
