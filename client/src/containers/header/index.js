import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import { ROOT_ROUTE } from '../../routes';

import Header from '../../components/header/';

import { auth } from '@openchemistry/girder-redux';
import girderClient from '@openchemistry/girder-client';
import { getServerSettings } from '../../redux/ducks/settings';
import { SOW10 } from '../../nodes';
import { isNil, isEmpty } from 'lodash-es';
import logo from '../../assets/logo.svg';

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
  const settings = getServerSettings(state);
  const { deployment, logoId } = settings;

  const props = {
      loggedIn
  };

  if (!isNil(deployment)) {
    props.showMenu = deployment !== SOW10;
    props.showSearch = deployment !== SOW10;
  }

  if (!isNil(logoId)) {
    const baseUrl = girderClient().getBaseURL();
    props.logo = `${baseUrl}/file/${logoId}/download`
  }
  else if (!isEmpty(settings)) {
    props.logo = logo;
  }


  return props
}

export default connect(mapStateToProps)(HeaderContainer);
