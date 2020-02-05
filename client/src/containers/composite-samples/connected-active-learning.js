import React, { Component } from 'react';

import { connect } from 'react-redux';
import { samplesToLines, downloadLinesAsCSV } from 'composition-plot';

import { getSamples, fetchSamples } from '../../redux/ducks/composites';

import { parseUrlMatch } from '../../nodes';
import NotFoundPage from '../../components/notFound.js';
import CompositeActiveLearningContainer from './active-learning';
import InfoExtractor from './info-extractor';

import {
  identity,
  defaultWrapper,
  onParamChanged,
  updateParams
} from '../../utils/url-props';

const URL_PARAMS = {
  platemapId: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  },
  runId: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  }
}

class CompositeSamplesContainer extends Component {

  constructor(props) {
    super(props);
    this.onParamChanged = onParamChanged.bind(this);
    this.updateParams = updateParams.bind(this);
  }

  componentDidMount() {
    const { dispatch, ancestors, item, platemapId, runId } = this.props;
    dispatch(fetchSamples({ancestors, item, platemapId, runId}));
  }

  downloadSamples = () => {
    const { samples, plateId } = this.props;
    let filename;
    if (plateId) {
      filename = `plate_${plateId}.csv`;
    } else {
      filename = 'plate.csv';
    }
    const lines = samplesToLines(samples, plateId);
    downloadLinesAsCSV(lines, filename);
  }

  getUrlParams() {
    return URL_PARAMS;
  }

  render() {
    const {
      samples
    } = this.props;

    if (samples.length === 0) {
      // return <NotFoundPage />;
      return null;
    }

    return (
      <InfoExtractor samples={samples}>
        <CompositeActiveLearningContainer
          {...this.props}
          samples={samples}
          onDownload={this.downloadSamples}
        />
      </InfoExtractor>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const ancestors = parseUrlMatch(ownProps.match);
  const item = ancestors.pop();
  const props = {
    ancestors,
    item
  }
  const searchParams = new URLSearchParams(ownProps.location.search);

  for (let key in URL_PARAMS) {
    props[key] = URL_PARAMS[key].deserialize(searchParams.get(key));
  }

  const plateId = searchParams.get('plateId');
  if (plateId) {
    props['plateId'] = plateId;
  }

  const samples = getSamples(state, props['platemapId'], props['runId']) || [];

  props['samples'] = samples;
  return props;
}

export default connect(mapStateToProps)(CompositeSamplesContainer);
