import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash-es'

import girderClient from '@openchemistry/girder-client';

import FooterComponent from '../../components/footer';
import { getServerSettings } from '../../redux/ducks/settings';
import { getDarkMode, enableDarkMode } from '../../redux/ducks/theme';

class FooterContainer extends Component {
  onEnableDarkMode = (enable) => {
    const { dispatch } = this.props;
    dispatch(enableDarkMode(enable));
  }

  render() {
    return (<FooterComponent {...this.props} onEnableDarkMode={this.onEnableDarkMode}></FooterComponent>);
  }
}

function mapStateToProps(state, ownProps) {
  const { privacy, license, footerLogoFileId, footerLogoUrl } = getServerSettings(state);
  const darkMode = getDarkMode(state);

  let footerLogoImageUrl = null;
  if (!isNil(footerLogoFileId)) {
    const baseUrl = girderClient().getBaseURL();
    footerLogoImageUrl = `${baseUrl}/file/${footerLogoFileId}/download`
  }

  return { privacy, license, footerLogoImageUrl, footerLogoUrl, darkMode };
}

export default connect(mapStateToProps)(FooterContainer);
