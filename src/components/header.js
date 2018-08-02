import React, { Component } from 'react';

import { AppBar, Toolbar, Button } from '@material-ui/core';

import logo from '../assets/logo.svg';

class Header extends Component {
  render() {
    return (
      <AppBar color="default" position="static">
        <Toolbar>
          <Button color="inherit" aria-label="Logo" style={{marginRight: 9}}
            onClick={this.props.onLogoClick}
          >
            <img className='logo' src={logo} alt="logo" />
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
