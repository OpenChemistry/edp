import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { Button } from '@material-ui/core';

import { parseUrlMatch } from '../../nodes';

import NotFoundPage from '../../components/notFound.js';
import { colors, makeCamera } from 'composition-plot';
import { NearestCompositionToPositionProvider, AnalyticalCompositionToPositionProvider } from 'composition-plot';
import { isNil } from 'lodash-es';
import ModelMetricsComponent from '../../components/composite-samples/model-metrics';
import CompositionPlot from '../../components/composite-samples/composition-plot';
import ControlsGrid from '../../components/composite-samples/controls/grid';
import SelectControlComponent from '../../components/composite-samples/controls/select';
import DoubleSliderControlComponent from '../../components/composite-samples/controls/double-slider';

import {
  identity,
  arraySerialize,
  arrayDeserialize,
  numberSerialize,
  numberDeserialize,
  defaultWrapper,
  onStateParamChanged,
  onParamChanged,
  updateParams
} from '../../utils/url-props';
import { combinations } from '../../utils/combinations';
import SliderControlComponent from '../../components/composite-samples/controls/slider';
import CompositionSpaceComponent from '../../components/composite-samples/controls/composition-space';
import { fetchModelMetadata, getModelMetadata, runModel, getModelData } from '../../redux/ducks/learning';
import ActiveLearningParametersComponent from '../../components/composite-samples/controls/active-learning';

const URL_PARAMS = {
  compositionPlot: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, '2d')
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
  filterRange: {
    serialize: defaultWrapper(arraySerialize, null),
    deserialize: defaultWrapper(arrayDeserialize, [0, 1])
  },
  mlModel: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, ''),
    callback: function(_currValue, _nextValue) {
      setTimeout(() => {
        this.setState(state => {
          state.modelParametersValues = {};
          return state;
        })
      }, 10);
    }
  },
  mlModelIteration: {
    serialize: defaultWrapper(numberSerialize, null),
    deserialize: defaultWrapper(numberDeserialize, 0)
  },
  mlModelMetric: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, 'MAE')
  }
}

class ActiveLearningContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      quatCompositionToPosition: new AnalyticalCompositionToPositionProvider(),
      octCompositionToPosition: null,
      modelParametersValues: {}
    }

    this.colorMaps = {
      'Viridis': colors.viridis,
      'Plasma': colors.plasma,
      'Red White Blue': colors.redWhiteBlue,
      'Green Blue': [[0, 1, 0], [0, 0, 1]],
    }

    this.onParamChanged = onParamChanged.bind(this);
    this.updateParams = updateParams.bind(this);
    this.onStateParamChanged = onStateParamChanged.bind(this);

    this.camera = makeCamera();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchModelMetadata());
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

  onCompositionChange(compositionPlot) {
    const { info } = this.props;
    const elements = info.getElements();
    let compositionSpace;
    if (compositionPlot === '3d') {
      compositionSpace = [...elements];
    } else if (compositionPlot === '2d') {
      compositionSpace = elements.slice(0, 4);
    }
    this.onParamChanged({compositionPlot, compositionSpace});
  }

  onRunModel = () => {
    const { samples, models, dispatch, mlModel } = this.props;

    if (isNil(models[mlModel])) {
      return;
    }

    const model = models[mlModel];
    const { modelParametersValues } = this.state;
    let parameters = {};
    for (let key in model.parameters) {
      parameters[key] = modelParametersValues[key] || model.parameters[key].default;
    }

    dispatch(runModel({model, samples, parameters}));
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
      scalarField,
      activeMap,
      colorMapRange,
      filterRange,
      models,
      mlModel,
      mlModelIteration,
      mlModelMetric,
      modelData
    } = this.props;

    const {
      quatCompositionToPosition,
      octCompositionToPosition,
      modelParametersValues
    } = this.state;

    if (samples.length === 0) {
      // return <NotFoundPage />;
      return null;
    }

    let compositionOptions = [
      {value: '3d', label: 'Multidimension'},
      {value: '2d', label: 'Quaternary'}
    ];

    const dataRange = info.getScalarRange(scalarField);
    const delta = dataRange[1] - dataRange[0];

    return (
      <Fragment>
        <ControlsGrid>
          <SelectControlComponent
            label="Composition plot"
            value={compositionPlot}
            options={compositionOptions}
            onChange={(value) => {this.onCompositionChange(value)}}
          />

          <SelectControlComponent
            label="Scalars"
            value={scalarField}
            options={info.getScalars()}
            onChange={(scalarField) => {this.onParamChanged({scalarField})}}
          />

          {compositionPlot === '2d' &&
          <CompositionSpaceComponent
            gridsize={{xs: 12}}
            compositionSpace={compositionSpace}
            elements={info.getElements()}
            n={info.getElements().length}
            k={4}
            onChange={(compositionSpace) => {this.onParamChanged({compositionSpace})}}
          />
          }

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

        <CompositionPlot
          samples={samples}
          compositionPlot={compositionPlot}
          compositionToPosition={compositionSpace.length > 4 ? octCompositionToPosition : quatCompositionToPosition}
          compositionSpace={compositionSpace}
          scalarField={scalarField}
          colorMaps={this.colorMaps}
          activeMap={activeMap}
          colorMapRange={colorMapRange}
          filterRange={filterRange}
          selectedSampleKeys={new Set()}
          camera={this.camera}
        />

        <br/>
        <ControlsGrid>
          <SelectControlComponent
            gridsize={{xs: 12}}
            label="Model"
            value={mlModel}
            options={['None'].concat(Object.keys(models).map(key => ({value: models[key].fileName, label: models[key].name})))}
            onChange={(mlModel) => {this.onParamChanged({mlModel})}}
          />
          <ActiveLearningParametersComponent
            gridsize={{xs: 12}}
            model={models[mlModel]}
            values={modelParametersValues}
            onChange={(key, value) => {this.setState(state => {state.modelParametersValues[key] = value; return state;})}}
          />
          { models[mlModel] &&
          <Button fullWidth gridsize={{xs: 12}} onClick={this.onRunModel} variant='contained' color='secondary'>
            Run
          </Button>
          }
        </ControlsGrid>
        <br/>

        {modelData &&
        <Fragment>
          {modelData.metrics &&
          <ModelMetricsComponent
            metrics={modelData.metrics}
            mlModelMetric={mlModelMetric}
            scalarField={scalarField}
            nIterations={Object.keys(modelData.metrics).length}
            onParamChanged={this.onParamChanged}
          />
          }
          <SliderControlComponent
            label="Model iteration"
            value={mlModelIteration}
            range={[0, Object.keys(modelData.metrics).length - 1]}
            step={1}
            onChange={(mlModelIteration) => {this.onParamChanged({mlModelIteration})}}
          />
          {modelData.samples[mlModelIteration] &&
          <CompositionPlot
            samples={modelData.samples[mlModelIteration]}
            compositionPlot={compositionPlot}
            compositionToPosition={compositionSpace.length > 4 ? octCompositionToPosition : quatCompositionToPosition}
            compositionSpace={compositionSpace}
            scalarField={scalarField}
            colorMaps={this.colorMaps}
            activeMap={activeMap}
            colorMapRange={colorMapRange}
            filterRange={filterRange}
            selectedSampleKeys={new Set()}
            camera={this.camera}
          />
          }

          {modelData.samplesCompare[mlModelIteration] &&
          <CompositionPlot
            samples={modelData.samplesCompare[mlModelIteration]}
            compositionPlot={compositionPlot}
            compositionToPosition={compositionSpace.length > 4 ? octCompositionToPosition : quatCompositionToPosition}
            compositionSpace={compositionSpace}
            scalarField={scalarField}
            colorMaps={this.colorMaps}
            activeMap='Red White Blue'
            colorMapRange={[-delta, delta]}
            filterRange={filterRange}
            selectedSampleKeys={new Set()}
            camera={this.camera}
          />
          }
        </Fragment>
        }
      </Fragment>
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

  const models = getModelMetadata(state);
  props['models'] = models;

  const modelData = getModelData(state, props['mlModel']);
  props['modelData'] = modelData;

  return props;
}

export default connect(mapStateToProps)(ActiveLearningContainer);
