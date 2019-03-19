import React, { Component } from 'react';

import { AppBar, Toolbar, Button, IconButton } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import { auth as authUI} from '@openchemistry/girder-ui';

class Header extends Component {
  render() {
    const { loggedIn, showMenu, showSearch, onLogoClick, onSearchClick, logo } = this.props;
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
          { showSearch && loggedIn  ? <IconButton onClick={onSearchClick}><Search/></IconButton> : null}
          { showMenu ? (loggedIn ? <authUI.UserMenu/> : <authUI.LoginButton/>) : null }
        </Toolbar>
      </AppBar>
    );
  }
}

Header.defaultProps = {
  showMenu: false,
  showLogin: false
};

export default Header;
