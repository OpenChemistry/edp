import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import { EXPERIMENT_LIST_ROUTE } from '../../routes';

import Header from '../../components/header/';

import { getAuthState } from '../../redux/ducks/auth';
import { isAuthenticated } from '@openchemistry/girder-auth-redux';

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
  const loggedIn = isAuthenticated(getAuthState(state));
  return {
    loggedIn
  }
}

export default connect(mapStateToProps)(HeaderContainer);
