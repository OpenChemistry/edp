import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import Menu from '../../components/header/menu';

import { getAuthState } from '../../redux/ducks/auth';
import { invalidateToken, getMe } from '@openchemistry/girder-auth-redux';

class MenuContainer extends Component {
  
  onSignOutClick = () => {
    this.props.dispatch(invalidateToken());
  }

  render() {
    return (
      <Menu
        me={this.props.me}
        handleSignOut={this.onSignOutClick}
      />
    );
  }
}

function mapStateToProps(state) {
  const me = getMe(getAuthState(state));
  return {
    me
  }
}

export default connect(mapStateToProps)(MenuContainer);
