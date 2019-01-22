import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { auth } from '@openchemistry/girder-redux';

import { ROOT_ROUTE, EXPERIMENT_VIEW_ROUTE, BATCH_VIEW_ROUTE, TEST_VIEW_ROUTE } from '../routes';

import BreadCrumb from '../components/breadCrumb';
import { parseUrl, makeUrl } from '../nodes';

class BreadCrumbContainer extends Component {

  onSegmentClick = (index) => {
    const { ancestors, dispatch } = this.props;
    if (index === -1) {
      dispatch(push(ROOT_ROUTE));
      return;
    }
    const ancestors_ = ancestors.slice(0, index);
    const item = ancestors[index];
    const url = makeUrl(ancestors_, item);
    dispatch(push(url));
  }

  render() {
    return (
      <BreadCrumb
        {...this.props}
        onSegmentClick={this.onSegmentClick}
      />
    );
  }
}

function mapStateToProps(state) {
  const me = auth.selectors.getMe(state);
  const ancestors = parseUrl(state.router.location.pathname);

  return {
    me,
    ancestors
  }
}

export default connect(mapStateToProps)(BreadCrumbContainer);
