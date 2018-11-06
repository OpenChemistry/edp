import React, { Component } from 'react';

import { connect } from 'react-redux';

import { getSamples, fetchSamples } from '../../redux/ducks/composites';

import { parseUrlMatch } from '../../utils/nodes';
import CompositeSamples from '../../components/composite-samples';

import NotFoundPage from '../../components/notFound.js';

class CompositeSamplesContainer extends Component {

  componentDidMount() {
    const { dispatch, ancestors, item, platemapId, runId} = this.props;
    dispatch(fetchSamples({ancestors, item, platemapId, runId}));
  }
  
  render() {
    const { samples } = this.props;

    if (samples.length === 0) {
      return <NotFoundPage />;
    }

    return (
      <div>
        <CompositeSamples samples={samples} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const ancestors = parseUrlMatch(ownProps.match);
  const item = ancestors.pop();
  const searchParams = new URLSearchParams(ownProps.location.search);
  const platemapId = searchParams.get('platemapId');
  const runId = searchParams.get('runId');
  let samples = getSamples(state, platemapId, runId);
  return {
    ancestors,
    item,
    platemapId,
    runId,
    samples
  };
}

export default connect(mapStateToProps)(CompositeSamplesContainer);
