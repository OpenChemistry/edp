import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';

import SamplesDetails from './details';

import QuaternaryPlotComponent from '../../components/composite-samples/quaternary-plot';

import NotFoundPage from '../../components/notFound.js';
import { colors } from 'composition-plot';
import { NearestCompositionToPositionProvider, AnaliticalCompositionToPositionProvider } from 'composition-plot';
import MultidimensionPlotComponent from '../../components/composite-samples/multidimension-plot';
import SelectControlComponent from '../../components/composite-samples/controls/select';
import DoubleSliderControlComponent from '../../components/composite-samples/controls/double-slider';
import SampleSelectionComponent from '../../components/composite-samples/controls/selection';

import {
  identity,
  arraySerialize,
  arrayDeserialize,
  numberSerialize,
  numberDeserialize,
  boolSerialize,
  boolDeserialize,
  defaultWrapper,
  onStateParamChanged,
  onParamChanged,
  updateParams
} from '../../utils/url-props';

const URL_PARAMS = {
  display: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, 'spectrum')
  },
  scalarField: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  },
  activeMap: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, 'Viridis')
  },
  colorMapRange: {
    serialize: defaultWrapper(arraySerialize, null),
    deserialize: defaultWrapper(arrayDeserialize, [0, 1])
  },
  compositionPlot: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, '2d')
  },
  filterRange: {
    serialize: defaultWrapper(arraySerialize, null),
    deserialize: defaultWrapper(arrayDeserialize, [0, 1])
  },
  xAxisS: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  },
  yAxisS: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  },
  yOffsetS: {
    serialize: defaultWrapper(numberSerialize, null),
    deserialize: defaultWrapper(numberDeserialize, 0)
  },
  yAxisH: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  },
  zAxisH: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  },
  reduceFnH: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, 'median')
  },
  separateSlopeH: {
    serialize: defaultWrapper(boolSerialize, null),
    deserialize: defaultWrapper(boolDeserialize, true)
  },
  selectionH: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, '')
  }
}

class CompositeSamplesContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      quatCompositionToPosition: new AnaliticalCompositionToPositionProvider(),
      octCompositionToPosition: null,
      scalarFields: [],
      dataRange: [0, 1]
    }

    this.colorMaps = {
      'Viridis': colors.viridis,
      'Plasma': colors.plasma,
      'Red White Blue': colors.redWhiteBlue,
      'Green Blue': [[0, 1, 0], [0, 0, 1]],
    }

    this.onStateParamChanged = onStateParamChanged.bind(this);
    this.onParamChanged = onParamChanged.bind(this);
    this.updateParams = updateParams.bind(this);
  }

  componentDidMount() {
    fetch('/8dcomp2xyz.json')
    .then(res => res.json())
    .then(data => {this.updateCompositionToPosition(data);})
    .catch(e=> console.log('ERRRR', e));
  }

  updateCompositionToPosition(data) {
    let compositionToPosition = null;

    if (Array.isArray(data)) {
      compositionToPosition = new NearestCompositionToPositionProvider();
      compositionToPosition.setData(8, 10, data, false);
    }

    this.setState(state => {
      state.octCompositionToPosition = compositionToPosition;
      return state;
    });
  }

  getUrlParams() {
    return URL_PARAMS;
  }

  render() {
    const {
      compositionPlot,
      samples,
      selectedSamples,
      selectedSampleKeys,
      display,
      scalarField,
      activeMap,
      colorMapRange,
      filterRange,
      xAxisS,
      yAxisS,
      yOffsetS,
      yAxisH,
      zAxisH,
      reduceFnH,
      separateSlopeH,
      selectionH,
      plots,
      showDetails
    } = this.props;

    let {
      onSampleSelect,
      onSampleDeselect,
      onSampleSelectById,
      onClearSelection
    } = this.props;

    const noOp = () => {};
    onSampleSelect = onSampleSelect || noOp;
    onSampleDeselect = onSampleDeselect || noOp;
    onSampleSelectById = onSampleSelectById || noOp;
    onClearSelection = onClearSelection || noOp;

    const {
      quatCompositionToPosition,
      octCompositionToPosition,
      scalarFields,
      dataRange
    } = this.state;

    if (samples.length === 0) {
      // return <NotFoundPage />;
      return null;
    }

    return (
      <div>
        <SelectControlComponent
          label="Scalars"
          value={scalarField}
          options={scalarFields}
          onChange={(scalarField) => {this.onParamChanged({scalarField})}}
        />

        <SelectControlComponent
          label="Color map"
          value={activeMap}
          options={Object.keys(this.colorMaps)}
          onChange={(activeMap) => {this.onParamChanged({activeMap})}}
        />

        <DoubleSliderControlComponent
          label="Map range"
          value={colorMapRange}
          range={dataRange}
          step={0.001}
          onChange={(colorMapRange) => {this.onParamChanged({colorMapRange})}}
        />

        <SelectControlComponent
          label="Composition plot"
          value={compositionPlot}
          options={[{value: '2d', label: 'Quaternary'}, {value: '3d', label: 'Multidimension'}]}
          onChange={(compositionPlot) => {this.onParamChanged({compositionPlot})}}
        />

        {compositionPlot !== '3d' &&
        <QuaternaryPlotComponent
          ref={(ref) => {this.quaternaryPlot = ref;}}
          samples={samples}
          scalarField={scalarField}
          colorMaps={this.colorMaps}
          activeMap={activeMap}
          colorMapRange={colorMapRange}
          selectedSampleKeys={selectedSampleKeys}
          onParamChanged={this.onParamChanged}
          onStateParamChanged={this.onStateParamChanged}
          onSampleSelect={onSampleSelect}
          onSampleDeselect={onSampleDeselect}
        />
        }

        {compositionPlot !== '2d' &&
        <MultidimensionPlotComponent
          samples={samples}
          compositionToPosition={quatCompositionToPosition}
          scalarField={scalarField}
          colorMaps={this.colorMaps}
          activeMap={activeMap}
          colorMapRange={colorMapRange}
          filterRange={filterRange}
          onParamChanged={this.onParamChanged}
          onStateParamChanged={this.onStateParamChanged}
        />
        }

        {showDetails &&
        <Fragment>
          <SampleSelectionComponent
            selectedSamples={selectedSamples}
            onSampleSelectById={onSampleSelectById}
            onClearSelection={onClearSelection}
          />

          <SamplesDetails
            display={display}
            selectedSamples={selectedSamples}
            onParamChanged={this.onParamChanged}
            xAxisS={xAxisS}
            yAxisS={yAxisS}
            yOffsetS={yOffsetS}
            yAxisH={yAxisH}
            zAxisH={zAxisH}
            reduceFnH={reduceFnH}
            separateSlopeH={separateSlopeH}
            selectionH={selectionH}
            plots={plots}
          />
        </Fragment>
        }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const props = {
  }
  const searchParams = new URLSearchParams(ownProps.location.search);

  for (let key in URL_PARAMS) {
    props[key] = URL_PARAMS[key].deserialize(searchParams.get(key));
  }
  return props;
}

export default connect(mapStateToProps)(CompositeSamplesContainer);
