import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth } from '@openchemistry/girder-redux';
import { Route } from 'react-router-dom';

import HomePage from '../components/home';


class PrivateRoute extends Component {
  render() {
    const {component, me, ...rest} = this.props;
    let RenderComponent = component;
    if (me) {
      return (
        <Route
          {...rest}
          render={(props) => {
            return <RenderComponent {...props}/>;
          }}
        />
      );
    } else {
      return (
        <HomePage/>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    me: auth.selectors.getMe(state)
  }
}

export default connect(mapStateToProps)(PrivateRoute);
