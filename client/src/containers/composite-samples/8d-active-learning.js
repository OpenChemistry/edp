import React, { Component } from 'react';

import NotFoundPage from '../../components/notFound.js';
import InfoExtractor from './info-extractor';
import CompositeActiveLearningContainer from './active-learning';

class CompositeSamplesContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      samples: []
    }
  }

  componentDidMount() {
    fetch(`${window.PUBLIC_URL}/8d_samples.json`)
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
        <CompositeActiveLearningContainer
          {...this.props}
          samples={samples}
        />
      </InfoExtractor>
    );
  }
}

export default CompositeSamplesContainer;
