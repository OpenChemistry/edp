import React, { Component } from 'react';

import { connect } from 'react-redux';

import { TIMESERIE_NODE, SAMPLE_NODE } from '../../utils/nodes';

import { getSamples, fetchSamples, fetchTimeSerie } from '../../redux/ducks/composites';

import { parseUrlMatch } from '../../utils/nodes';
import CompositeSamples from '../../components/composite-samples';

import NotFoundPage from '../../components/notFound.js';

class CompositeSamplesContainer extends Component {

  componentDidMount() {
    const { dispatch, ancestors, item, platemapId, runId} = this.props;
    dispatch(fetchSamples({ancestors, item, platemapId, runId}));
  }

  onSampleSelect = (sample) => {
    const { ancestors, item, dispatch } = this.props;
    const ancestors_ = [...ancestors, item, {type: SAMPLE_NODE, _id: sample._id}];
    const item_ = {type: TIMESERIE_NODE};
    dispatch(fetchTimeSerie({ancestors: ancestors_, item: item_}));
  }

  onSampleDeselect = (d) => {
    console.log('Deselect', d);
  }
  
  render() {
    const { samples } = this.props;

    if (samples.length === 0) {
      return <NotFoundPage />;
    }

    return (
      <div>
        <CompositeSamples
          samples={samples}
          onSampleSelect={this.onSampleSelect}
          onSampleDeselect={this.onSampleDeselect}
        />
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
