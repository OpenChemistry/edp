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
  const { selectedSamples, fitted } = ownProps;
  const timeseries = selectedSamples
    .map(sample => ({sample, spectrum: getTimeSerie(state, sample._id, fitted)}))
    .filter(timeserie => timeserie.spectrum);

  return {
    timeseries
  };
}

export default connect(mapStateToProps)(SamplesDetailsContainer);
