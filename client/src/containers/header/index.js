import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import { EXPERIMENT_LIST_ROUTE } from '../../routes';

import Header from '../../components/header/';

import { auth } from '@openchemistry/girder-redux';

class HeaderContainer extends Component {
  
  onLogoClick = () => {
    this.props.dispatch(push(EXPERIMENT_LIST_ROUTE));
  }

  render() {
    return (
      <Header
        onLogoClick={this.onLogoClick}
        loggedIn={this.props.loggedIn}
      />
    );
  }
}

function mapStateToProps(state) {
  const loggedIn = auth.selectors.isAuthenticated(state);
  return {
    loggedIn
  }
}

export default connect(mapStateToProps)(HeaderContainer);
