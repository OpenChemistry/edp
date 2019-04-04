import React, { Component } from 'react';

import { AppBar, Toolbar, Button, IconButton, withStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';

import { auth as authUI} from '@openchemistry/girder-ui';

const style = theme => ({
  logoImg: {
    height: 6 * theme.spacing.unit
  }
});

class Header extends Component {
  render() {
    const { loggedIn, showMenu, showSearch, onLogoClick, onSearchClick, leftLogo,
            rightLogo, headerRightLogoUrl, classes } = this.props;
    return (
      <AppBar color="default" position="static">
        <Toolbar>
          <Button color="inherit" aria-label="Logo" style={{marginRight: 9}}
            onClick={onLogoClick}
          >
            <img className={classes.logoImg} src={leftLogo} alt="logo" />
          </Button>
          <div style={{flex: 1}}>
          </div>
          { rightLogo && <Button component="a" href={headerRightLogoUrl} target="_blank"><img className={classes.logoImg} src={rightLogo}/></Button>}
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

export default withStyles(style)(Header)
