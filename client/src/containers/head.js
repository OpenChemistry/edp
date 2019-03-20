import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Helmet} from "react-helmet";
import { isNil, isEmpty } from 'lodash-es';

import girderClient from '@openchemistry/girder-client';

import { getServerSettings } from '../redux/ducks/settings';

class Head extends Component {

  render() {
    const {faviconUrl} = this.props;
    return (
      <Helmet>
        <link rel="shortcut icon" href={faviconUrl} />
      </Helmet>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const settings = getServerSettings(state);
  const { faviconFileId } = settings;

  let faviconUrl = null;
  if (!isNil(faviconFileId)) {
    const baseUrl = girderClient().getBaseURL();
    faviconUrl = `${baseUrl}/file/${faviconFileId}/download`;
  }
  else if (!isEmpty(settings)) {
    faviconUrl = `${window.PUBLIC_URL}/favicon.png`
  }

  return {
    faviconUrl
  };

}

Head = connect(mapStateToProps)(Head);

export default Head;
