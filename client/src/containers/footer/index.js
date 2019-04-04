import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isNil } from 'lodash-es'

import girderClient from '@openchemistry/girder-client';

import FooterComponent from '../../components/footer';
import { getServerSettings } from '../../redux/ducks/settings';

class FooterContainer extends Component {
  render() {
    return (<FooterComponent {...this.props}></FooterComponent>);
  }
}

function mapStateToProps(state, ownProps) {
  const { privacy, license, footerLogoFileId, footerLogoUrl } = getServerSettings(state);

  let footerLogoImageUrl = null;
  if (!isNil(footerLogoFileId)) {
    const baseUrl = girderClient().getBaseURL();
    footerLogoImageUrl = `${baseUrl}/file/${footerLogoFileId}/download`
  }

  return { privacy, license, footerLogoImageUrl, footerLogoUrl };
}

export default connect(mapStateToProps)(FooterContainer);
