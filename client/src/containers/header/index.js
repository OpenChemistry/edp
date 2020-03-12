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
import { getDarkMode } from '../../redux/ducks/theme';

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
  const darkMode = getDarkMode(state);
  const { deployment, showMenu, showSearch, headerLeftLogoFileId,
          headerRightLogoFileId, headerRightLogoUrl, headerLeftLogoDarkFileId } = settings;

  const props = {
      loggedIn,
      headerRightLogoUrl,
      darkMode
  };

  if (!isNil(settings)) {
    props.showMenu = showMenu;
    props.showSearch = showSearch;
  }

  const leftLogoId = darkMode ? headerLeftLogoDarkFileId || headerLeftLogoFileId : headerLeftLogoFileId;
  if (!isNil(leftLogoId)) {
    const baseUrl = girderClient().getBaseURL();
    props.leftLogo = `${baseUrl}/file/${leftLogoId}/download`
  }
  else if (!isEmpty(settings)) {
    props.leftLogo = logo;
  }

  if (!isNil(headerRightLogoFileId)) {
    const baseUrl = girderClient().getBaseURL();
    props.rightLogo = `${baseUrl}/file/${headerRightLogoFileId}/download`
  }

  return props
}

HeaderContainer.defaultProps = {
  showMenu: false,
  showSearch: false
}

export default connect(mapStateToProps)(HeaderContainer);
