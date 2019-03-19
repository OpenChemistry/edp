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
  console.log(state)
  const settings = getServerSettings(state);
  const { faviconId } = settings;

  let faviconUrl = null;
  if (!isNil(faviconId)) {
    const baseUrl = girderClient().getBaseURL();
    faviconUrl = `${baseUrl}/file/${faviconId}/download`;
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
