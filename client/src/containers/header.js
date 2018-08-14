import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import { EXPERIMENT_LIST_ROUTE } from '../routes';

import Header from '../components/header';

class HeaderContainer extends Component {
  
  onLogoClick = () => {
    this.props.dispatch(push(EXPERIMENT_LIST_ROUTE));
  }

  render() {
    return (
      <Header
        onLogoClick={this.onLogoClick}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(HeaderContainer);
