import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth } from '@openchemistry/girder-redux';
import { Route } from 'react-router-dom';

import HomePage from '../components/home';


class PublicRoute extends Component {
  render() {
    const {component, authenticating, ...rest} = this.props;
    let RenderComponent = component;
    if (authenticating) {
      return null;
    } else {
      return (
        <Route
          {...rest}
          render={(props) => {
            return <RenderComponent {...props}/>;
          }}
        />
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    authenticating: auth.selectors.isAuthenticating(state)
  }
}

export default connect(mapStateToProps)(PublicRoute);
