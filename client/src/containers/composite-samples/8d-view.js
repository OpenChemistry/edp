import React, { Component } from 'react';

import { connect } from 'react-redux';

import { TIMESERIE_NODE, SAMPLE_NODE } from '../../nodes/sow8/hierarchy';

import { getSamples, fetchSamples, fetchTimeSerie } from '../../redux/ducks/composites';

import { parseUrlMatch } from '../../nodes';
import NotFoundPage from '../../components/notFound.js';
import InfoExtractor from './info-extractor';
import CompositeViewContainer from './view';

class CompositeSamplesContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      samples: []
    }
  }

  componentDidMount() {
    fetch('/8d_samples.json')
    .then(res => res.json())
    .then(samples => {
      this.setState(state => {
        state.samples = samples;
        return state;
      });
    })
    .catch(e=> console.log('ERRRR', e));
  }

  render() {
    const { samples } = this.state;

    if (samples.length === 0) {
      // return <NotFoundPage />;
      return null;
    }

    return (
      <InfoExtractor samples={samples}>
        <CompositeViewContainer
          {...this.props}
          samples={samples}
          selectedSamples={[]}
          selectedSampleKeys={new Set()}
          showDetails={false}
        />
      </InfoExtractor>
    );
  }
}

export default CompositeSamplesContainer;
