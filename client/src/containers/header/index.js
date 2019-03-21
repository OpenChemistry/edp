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
  const { deployment, headerLogoFileId, showMenu, showSearch } = settings;

  const props = {
      loggedIn
  };

  if (!isNil(settings)) {
    props.showMenu = showMenu;
    props.showSearch = showSearch;
  }

  if (!isNil(headerLogoFileId)) {
    const baseUrl = girderClient().getBaseURL();
    props.logo = `${baseUrl}/file/${headerLogoFileId}/download`
  }
  else if (!isEmpty(settings)) {
    props.logo = logo;
  }


  return props
}

HeaderContainer.defaultProps = {
  showMenu: false,
  showSearch: false
}

export default connect(mapStateToProps)(HeaderContainer);
