import React, { Component } from 'react';

import { connect } from 'react-redux';

import { TIMESERIE_NODE, SAMPLE_NODE } from '../../utils/nodes';

import { getSamples, fetchSamples, fetchTimeSerie } from '../../redux/ducks/composites';

import { parseUrlMatch } from '../../utils/nodes';
import CompositeSamples from '../../components/composite-samples';
import SpectrumComponent from './spectrum';

import NotFoundPage from '../../components/notFound.js';

class CompositeSamplesContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedSamples: []
    }
  }

  componentDidMount() {
    const { dispatch, ancestors, item, platemapId, runId} = this.props;
    dispatch(fetchSamples({ancestors, item, platemapId, runId}));
  }

  onSampleSelect = (sample) => {
    const { ancestors, item, dispatch } = this.props;
    const ancestors_ = [...ancestors, item, {type: SAMPLE_NODE, _id: sample._id}];
    const item_ = {type: TIMESERIE_NODE};
    dispatch(fetchTimeSerie({ancestors: ancestors_, item: item_}));
    this.setState((state, props) => {
      state.selectedSamples.push(sample);
      return state;
    });
  }

  onSampleDeselect = (sample) => {
    this.setState(state => {
      state.selectedSamples = state.selectedSamples.filter( s => s._id !== sample._id);
      return state;
    });
  }

  render() {
    const { samples } = this.props;
    const { selectedSamples } = this.state;

    if (samples.length === 0) {
      // return <NotFoundPage />;
      return null;
    }

    return (
      <div>
        <CompositeSamples
          samples={samples}
          onSampleSelect={this.onSampleSelect}
          onSampleDeselect={this.onSampleDeselect}
        />
        <SpectrumComponent
          selectedSamples={selectedSamples}
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
