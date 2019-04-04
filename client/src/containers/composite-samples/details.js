import React, { Component } from 'react';

import { connect } from 'react-redux';

import { getTimeSerie } from '../../redux/ducks/composites';

import SamplesDetails from '../../components/composite-samples/details';

class SamplesDetailsContainer extends Component {
  
  render() {
    const { timeseries } = this.props;

    if (timeseries.length === 0) {
      return (
        <div style={{width: '100%', height: '48rem'}}></div>
      );
    }

    return (
      <SamplesDetails {...this.props} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { selectedSamples, plots } = ownProps;
  const getFitted = plots.includes('fitted');
  const getRaw = plots.includes('raw');

  let rawTimeseries = [];
  let fittedTimeseries = [];

  if (getRaw) {
    rawTimeseries = selectedSamples
    .map(sample => ({sample, spectrum: getTimeSerie(state, sample._id, false)}))
    .filter(timeserie => timeserie.spectrum);
  }

  if (getFitted) {
    fittedTimeseries = selectedSamples
    .map(sample => ({sample, spectrum: getTimeSerie(state, sample._id, true)}))
    .filter(timeserie => timeserie.spectrum);
  }

  return {
    timeseries: Array.concat(rawTimeseries, fittedTimeseries)
  };
}

export default connect(mapStateToProps)(SamplesDetailsContainer);
