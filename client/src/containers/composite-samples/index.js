import React, { Component } from 'react';

import { connect } from 'react-redux';

import { TIMESERIE_NODE, SAMPLE_NODE } from '../../utils/nodes';

import { getSamples, fetchSamples, fetchTimeSerie } from '../../redux/ducks/composites';

import { parseUrlMatch } from '../../utils/nodes';
import CompositeSamples from '../../components/composite-samples';
import SamplesDetails from './details';

import NotFoundPage from '../../components/notFound.js';

class CompositeSamplesContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedSamples: [],
      selectedSampleKeys: new Set()
    }
  }

  componentDidMount() {
    const { dispatch, ancestors, item, platemapId, runId} = this.props;
    dispatch(fetchSamples({ancestors, item, platemapId, runId}));
  }

  onSampleSelectById = (id) => {
    const { samples } = this.props;
    const matches = samples.filter((s) => s.sampleNum == id);
    if (matches.length === 0) {
      return;
    }

    const sample = matches[0];
    const {selectedSampleKeys} = this.state;
    if (selectedSampleKeys.has(sample._id)) {
      return;
    }

    this.onSampleSelect(sample);
  }

  onClearSelection = () => {
    const selectedSamples = [];
    const selectedSampleKeys = this.getSelectedSampleKeys(selectedSamples);
    this.setState({selectedSamples, selectedSampleKeys});
  }

  onSampleSelect = (sample) => {
    const { ancestors, item, dispatch } = this.props;
    const ancestors_ = [...ancestors, item, {type: SAMPLE_NODE, _id: sample._id}];
    const item_ = {type: TIMESERIE_NODE};
    dispatch(fetchTimeSerie({ancestors: ancestors_, item: item_}));
    this.setState((state, props) => {
      state.selectedSamples.push(sample);
      state.selectedSampleKeys = this.getSelectedSampleKeys(state.selectedSamples);
      return state;
    });
  }

  onSampleDeselect = (sample) => {
    this.setState(state => {
      state.selectedSamples = state.selectedSamples.filter( s => s._id !== sample._id);
      state.selectedSampleKeys = this.getSelectedSampleKeys(state.selectedSamples);
      return state;
    });
  }

  getSelectedSampleKeys = (selectedSamples) => {
    const selectedSampleKeys = new Set();
    for (let sample of selectedSamples) {
      selectedSampleKeys.add(sample._id);
    }
    return selectedSampleKeys;
  }

  render() {
    const { samples } = this.props;
    const { selectedSamples, selectedSampleKeys } = this.state;

    if (samples.length === 0) {
      // return <NotFoundPage />;
      return null;
    }

    return (
      <div>
        <CompositeSamples
          samples={samples}
          selectedSamples={selectedSamples}
          selectedSampleKeys={selectedSampleKeys}
          onSampleSelect={this.onSampleSelect}
          onSampleDeselect={this.onSampleDeselect}
          onSampleSelectById={this.onSampleSelectById}
          onClearSelection={this.onClearSelection}
        />
        <SamplesDetails
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
