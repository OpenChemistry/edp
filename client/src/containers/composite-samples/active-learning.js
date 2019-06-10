import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { Button, Typography } from '@material-ui/core';

import { parseUrlMatch } from '../../nodes';

import NotFoundPage from '../../components/notFound.js';
import { colors, makeCamera } from 'composition-plot';
import { NearestCompositionToPositionProvider, AnalyticalCompositionToPositionProvider } from 'composition-plot';
import { isNil } from 'lodash-es';
import ModelsContainer from './models';
import CompositionPlot from '../../components/composite-samples/composition-plot';
import ControlsGrid from '../../components/composite-samples/controls/grid';
import SelectControlComponent from '../../components/composite-samples/controls/select';
import SliderControlComponent from '../../components/composite-samples/controls/slider';
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
import CompositionSpaceComponent from '../../components/composite-samples/controls/composition-space';
import { fetchModelMetadata, getModelMetadata, runModel } from '../../redux/ducks/learning';
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
  ballSize: {
    serialize: defaultWrapper(numberSerialize, null),
    deserialize: defaultWrapper(numberDeserialize, 1.5)
  }
}

class ActiveLearningContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      quatCompositionToPosition: new AnalyticalCompositionToPositionProvider(),
      octCompositionToPosition: null,
      modelParametersValues: {},
      modelIds: [],
      modelName: '',
      trainingOpacity: 1,
      testOpacity: 0.25
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

  onModelChange = (modelName) => {
    this.setState(state => {
      state.modelName = modelName;
      state.modelParametersValues = {};
      return state;
    })
  }

  onRunModel = () => {
    const { samples, models, dispatch } = this.props;
    const { modelName } = this.state;

    if (isNil(models[modelName])) {
      return;
    }

    const model = models[modelName];
    const { modelParametersValues } = this.state;
    let parameters = {};
    for (let key in model.parameters) {
      parameters[key] = modelParametersValues[key] || model.parameters[key].default;
    }

    const modelId = Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(32);

    dispatch(runModel({model, samples, parameters, modelId}));

    this.setState( state => {
      const modelIds = [modelId, ...state.modelIds];
      state.modelIds = modelIds;
      return state;
    })
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
      modelData,
      ballSize
    } = this.props;

    const {
      quatCompositionToPosition,
      octCompositionToPosition,
      modelParametersValues,
      modelName,
      modelIds,
      trainingOpacity,
      testOpacity
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

    const opacityOrSize = compositionPlot === '2d' ? 'Opacity' : 'Size';

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

          {compositionPlot === '3d' &&
          <SliderControlComponent
            gridsize={{xs: 12}}
            label="Sphere size"
            value={ballSize}
            range={[0, 6]}
            step={0.1}
            onChange={(ballSize) => {this.onParamChanged({ballSize})}}
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
          ballSize={ballSize}
          selectedSampleKeys={new Set()}
          camera={this.camera}
        />

        <br/>
        <ControlsGrid>
          <SelectControlComponent
            gridsize={{xs: 12}}
            label="Model"
            value={modelName}
            options={['None'].concat(Object.keys(models).map(key => ({value: models[key].fileName, label: models[key].name})))}
            onChange={(modelName) => {this.onModelChange(modelName)}}
          />
          <ActiveLearningParametersComponent
            gridsize={{xs: 12}}
            model={models[modelName]}
            values={modelParametersValues}
            onChange={(key, value) => {this.setState(state => {state.modelParametersValues[key] = value; return state;})}}
          />
          { models[modelName] &&
          <Button fullWidth gridsize={{xs: 12}} variant='contained' color='secondary'
            onClick={this.onRunModel}
            disabled={modelData && modelData.pending}
          >
            Run
          </Button>
          }
          {modelIds.length > 0 &&
          <SliderControlComponent
            gridsize={{xs: 6}}
            label={`Training Set ${opacityOrSize}`}
            value={trainingOpacity}
            range={[0, 1]}
            onChange={(opacity) => {this.setState(state => {state.trainingOpacity = opacity; return state;})}}
          />
          }
          {modelIds.length > 0 &&
          <SliderControlComponent
            gridsize={{xs: 6}}
            label={`Test Set ${opacityOrSize}`}
            value={testOpacity}
            range={[0, 1]}
            onChange={(opacity) => {this.setState(state => {state.testOpacity = opacity; return state;})}}
          />
          }
        </ControlsGrid>
        <br/>

        <ModelsContainer
          modelIds={modelIds}
          compositionPlot={compositionPlot}
          compositionToPosition={compositionSpace.length > 4 ? octCompositionToPosition : quatCompositionToPosition}
          compositionSpace={compositionSpace}
          dataRange={dataRange}
          colorMaps={this.colorMaps}
          activeMap={activeMap}
          colorMapRange={colorMapRange}
          filterRange={filterRange}
          ballSize={ballSize}
          camera={this.camera}
          scalarField={scalarField}
          trainingOpacity={trainingOpacity}
          testOpacity={testOpacity}
        />
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


  return props;
}

export default connect(mapStateToProps)(ActiveLearningContainer);
