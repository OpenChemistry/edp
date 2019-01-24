import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import { ROOT_ROUTE } from '../../routes';

import Header from '../../components/header/';

import { auth } from '@openchemistry/girder-redux';
import { getServerSettings } from '../../redux/ducks/settings';
import { SOW10 } from '../../nodes';

class HeaderContainer extends Component {
  
  onLogoClick = () => {
    this.props.dispatch(push(ROOT_ROUTE));
  }

  onSearchClick = () => {
    this.props.dispatch(push(`${ROOT_ROUTE}search`));
  }

  render() {
    return (
      <Header
        {...this.props}
        onLogoClick={this.onLogoClick}
        onSearchClick={this.onSearchClick}
      />
    );
  }
}

function mapStateToProps(state) {
  const loggedIn = auth.selectors.isAuthenticated(state);
  const { deployment } = getServerSettings(state);
  const showMenu = deployment !== SOW10;
  const showSearch = deployment !== SOW10;

  return {
    loggedIn,
    showMenu,
    showSearch
  }
}

export default connect(mapStateToProps)(HeaderContainer);
