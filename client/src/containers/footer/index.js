import React, { Component } from 'react';
import { connect } from 'react-redux';

import FooterComponent from '../../components/footer';
import { getServerSettings } from '../../redux/ducks/settings';

class FooterContainer extends Component {
  render() {
    return (<FooterComponent {...this.props}></FooterComponent>);
  }
}

function mapStateToProps(state, ownProps) {
  const { privacy, license } = getServerSettings(state);
  return { privacy, license };
}

export default connect(mapStateToProps)(FooterContainer);
