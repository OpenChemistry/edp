import React, { Component } from 'react';

import { connect } from 'react-redux';

import { getTimeSerie } from '../../redux/ducks/composites';

import SamplesDetails from '../../components/composite-samples/details';

class SamplesDetailsContainer extends Component {
  
  render() {
    const { timeseries } = this.props;

    if (timeseries.length === 0) {
      return null;
    }

    return (
      <SamplesDetails timeseries={timeseries} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { selectedSamples } = ownProps;
  const timeseries = selectedSamples
    .map(sample => ({sample, spectrum: getTimeSerie(state, sample._id)}))
    .filter(timeserie => timeserie.spectrum);

  return {
    timeseries
  };
}

export default connect(mapStateToProps)(SamplesDetailsContainer);
