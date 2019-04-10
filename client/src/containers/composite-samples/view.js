import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';

import SamplesDetails from './details';

import QuaternaryPlotComponent from '../../components/composite-samples/quaternary-plot';

import NotFoundPage from '../../components/notFound.js';
import { colors } from 'composition-plot';
import { NearestCompositionToPositionProvider, AnaliticalCompositionToPositionProvider } from 'composition-plot';

import MultidimensionPlotComponent from '../../components/composite-samples/multidimension-plot';
import ControlsGrid from '../../components/composite-samples/controls/grid';
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
import { combinations } from '../../utils/combinations';

const URL_PARAMS = {
  display: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, 'spectrum')
  },
  scalarField: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null),
    callback: function(currValue, nextValue) {
      const { info } = this.props;
      let scalarField = info.getValidScalar(nextValue);

      const updates = {};

      if (scalarField !== nextValue) {
        updates['scalarField'] = scalarField;
      }

      let colorMapRange = info.getScalarRange(scalarField);
      updates['colorMapRange'] = colorMapRange;

      setTimeout(() => {
        this.onParamChanged(updates);
      }, 0);
    }
  },
  activeMap: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, 'Viridis')
  },
  colorMapRange: {
    serialize: defaultWrapper(arraySerialize, null),
    deserialize: defaultWrapper(arrayDeserialize, [0, 1])
  },
  compositionSpace: {
    serialize: defaultWrapper(arraySerialize, null),
    deserialize: defaultWrapper(arrayDeserialize, [])
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
      octCompositionToPosition: null
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
    this.initializeScalars();

    fetch('/8dcomp2xyz.json')
    .then(res => res.json())
    .then(data => {this.updateCompositionToPosition(data);})
    .catch(e=> console.log('ERRRR', e));
  }

  initializeScalars() {
    const { info } = this.props;
    let { scalarField } = this.props;
    let validScalar = info.getValidScalar(scalarField);
    let updates = {};
    if (validScalar !== scalarField) {
      updates['scalarField'] = scalarField;
    }

    let { compositionSpace } = this.props;
    let validComposition = true;
    for (let element of compositionSpace) {
      if (!info.elements.has(element)) {
        validComposition = false;
        break;
      }
    }
    validComposition = validComposition && compositionSpace.length >= 4;

    if (!validComposition) {
      try {
        compositionSpace = combinations(info.getElements(), 4).next().value;
        updates['compositionSpace'] = compositionSpace;
      } catch {}
    }

    this.onParamChanged(updates);
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

  onCompositionChange(value) {
    try {
      value = JSON.parse(value);
      if (!Array.isArray(value)) {
        return;
      }
    } catch {
      return;
    }

    let [compositionPlot, ...compositionSpace] = value;
    const { info } = this.props;
    const elements = info.getElements();
    if (compositionPlot === '3d') {
      compositionSpace = [...elements];
    }
    this.onParamChanged({compositionPlot, compositionSpace});
  }

  getUrlParams() {
    return URL_PARAMS;
  }

  render() {
    const {
      info,
      compositionPlot,
      compositionSpace,
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
    } = this.state;

    if (samples.length === 0) {
      // return <NotFoundPage />;
      return null;
    }

    let compositionOptions = [{value: JSON.stringify(['3d'].concat(info.getElements())), label: 'Multidimension'}];
    for (let comb of combinations(info.getElements(), 4)) {
      compositionOptions.push({value: JSON.stringify(['2d'].concat(comb)), label: comb.join(', ')});
    }

    return (
      <Fragment>
        <ControlsGrid>
          <SelectControlComponent
            label="Composition plot"
            value={JSON.stringify([compositionPlot].concat(compositionSpace))}
            options={compositionOptions}
            onChange={(value) => {this.onCompositionChange(value)}}
          />

          <SelectControlComponent
            label="Scalars"
            value={scalarField}
            options={info.getScalars()}
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
            range={info.getScalarRange(scalarField)}
            step={0.001}
            onChange={(colorMapRange) => {this.onParamChanged({colorMapRange})}}
          />
        </ControlsGrid>

        {compositionPlot == '2d' &&
        <QuaternaryPlotComponent
          ref={(ref) => {this.quaternaryPlot = ref;}}
          samples={samples}
          compositionSpace={compositionSpace}
          scalarField={scalarField}
          colorMaps={this.colorMaps}
          activeMap={activeMap}
          colorMapRange={colorMapRange}
          selectedSampleKeys={selectedSampleKeys}
          onSampleSelect={onSampleSelect}
          onSampleDeselect={onSampleDeselect}
        />
        }

        {compositionPlot == '3d' &&
        <MultidimensionPlotComponent
          samples={samples}
          compositionToPosition={quatCompositionToPosition}
          compositionSpace={compositionSpace}
          scalarField={scalarField}
          colorMaps={this.colorMaps}
          activeMap={activeMap}
          colorMapRange={colorMapRange}
          filterRange={filterRange}
          onParamChanged={this.onParamChanged}
          onStateParamChanged={noOp}
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
      </Fragment>
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
