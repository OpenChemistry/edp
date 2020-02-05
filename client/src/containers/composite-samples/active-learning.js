import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { Button, Grid, Box } from '@material-ui/core';
import { CloudDownload } from '@material-ui/icons';

import { parseUrlMatch, ACE_1 } from '../../nodes';

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
import CheckboxControlComponent from '../../components/composite-samples/controls/checkbox';

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
import CompositionSpaceComponent from '../../components/composite-samples/controls/composition-space';
import { fetchModelMetadata, getModelMetadata, runModel } from '../../redux/ducks/learning';
import ActiveLearningParametersComponent from '../../components/composite-samples/controls/active-learning';
import { getServerSettings } from '../../redux/ducks/settings';

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
    deserialize: defaultWrapper(identity, 'viridis')
  },
  invertMap: {
    serialize: defaultWrapper(boolSerialize, null),
    deserialize: defaultWrapper(boolDeserialize, false)
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
  },
  compositionSpaceSize: {
    serialize: defaultWrapper(numberSerialize, null),
    deserialize: defaultWrapper(numberDeserialize, 4),
    callback: function(currValue, nextValue) {
      setTimeout(() => {
        const compositionSpace = this.initializeCompositionSpace();
        this.onParamChanged({compositionSpace});
      }, 0);
    }
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

    this.colorMaps = {...colors.presets};

    this.onParamChanged = onParamChanged.bind(this);
    this.updateParams = updateParams.bind(this);
    this.onStateParamChanged = onStateParamChanged.bind(this);

    this.camera = makeCamera();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchModelMetadata());
    this.initializeScalars();

    fetch(`${window.PUBLIC_URL}/8dcomp2xyz.json`)
    .then(res => res.json())
    .then(data => {this.updateCompositionToPosition(data);})
    .catch(e=> console.log('ERRRR', e));
  }

  initializeScalars() {
    const { compositionSpaceSize, info } = this.props;
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
    validComposition = validComposition && compositionSpace.length === compositionSpaceSize;

    if (!validComposition) {
      updates['compositionSpace'] = this.initializeCompositionSpace();
    }

    this.onParamChanged(updates);
  }

  initializeCompositionSpace() {
    const { compositionSpaceSize, info } = this.props;
    try {
      return combinations(info.getElements(), compositionSpaceSize).next().value;
    } catch {
      return [];
    }
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
    let { compositionSpace, compositionSpaceSize } = this.props;
    const elements = info.getElements();
    if (compositionPlot === '2d') {
      if (compositionSpaceSize < 4 || compositionSpaceSize > 4) {
        compositionSpaceSize = 4;
        compositionSpace = elements.slice(0, 4);
      }
    }
    this.onParamChanged({compositionPlot, compositionSpace, compositionSpaceSize});
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
      invertMap,
      colorMapRange,
      filterRange,
      models,
      modelData,
      ballSize,
      compositionSpaceSize,
      deployment,
      onDownload
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

    const compositionSpaceSizeOptions = [];
    const minSpace = compositionPlot === '2d' ? 4 : 2;
    const maxSpace = compositionPlot === '2d' ? 4 : info.getElements().length;
    for (let i = minSpace; i <= maxSpace; ++i) {
      compositionSpaceSizeOptions.push(i);
    }

    const dataRange = info.getScalarRange(scalarField);

    const opacityOrSize = compositionPlot === '2d' ? 'Opacity' : 'Size';

    return (
      <Fragment>
        <ControlsGrid>
          <SelectControlComponent
            gridsize={{xs: 3}}
            label="Composition plot"
            value={compositionPlot}
            options={compositionOptions}
            onChange={(value) => {this.onCompositionChange(value)}}
          />

          <SelectControlComponent
            gridsize={{xs: 3}}
            label="Composition space"
            value={compositionSpaceSize}
            options={compositionSpaceSizeOptions}
            onChange={(compositionSpaceSize) => {this.onParamChanged({compositionSpaceSize})}}
          />

          <SelectControlComponent
            label="Scalars"
            value={scalarField}
            options={info.getScalars()}
            onChange={(scalarField) => {this.onParamChanged({scalarField})}}
          />

          <CompositionSpaceComponent
            gridsize={{xs: 12}}
            compositionSpace={compositionSpace}
            elements={info.getElements()}
            n={info.getElements().length}
            k={compositionSpaceSize}
            onChange={(compositionSpace) => {this.onParamChanged({compositionSpace})}}
          />

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

          <div style={{display: 'flex'}}>
            <div style={{flexGrow: 1}}>
              <SelectControlComponent
                label="Color map"
                value={activeMap}
                options={Object.keys(this.colorMaps)}
                onChange={(activeMap) => {this.onParamChanged({activeMap})}}
              />
            </div>

            <div>
              <CheckboxControlComponent
                label="Invert"
                value={invertMap}
                onChange={(invertMap) => {this.onParamChanged({invertMap})}}
              />
            </div>
          </div>

          <DoubleSliderControlComponent
            label="Map range"
            value={colorMapRange}
            range={info.getScalarRange(scalarField)}
            step={0.001}
            digits={3}
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
          invertMap={invertMap}
          colorMapRange={colorMapRange}
          filterRange={filterRange}
          ballSize={ballSize}
          selectedSampleKeys={new Set()}
          showLegend={true}
          camera={this.camera}
        />

        { deployment === ACE_1 &&
        <Grid container justify='flex-end'>
          <Box marginTop={2}>
            <Button onClick={onDownload} color="primary" variant="outlined" size="small">
              <CloudDownload/>&nbsp;&nbsp;<b>Download as CSV</b>
            </Button>
          </Box>
        </Grid>
        }

        <br/>
        {deployment !== ACE_1 &&
        <Fragment>
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
              step={0.05}
              onChange={(opacity) => {this.setState(state => {state.trainingOpacity = opacity; return state;})}}
            />
            }
            {modelIds.length > 0 &&
            <SliderControlComponent
              gridsize={{xs: 6}}
              label={`Test Set ${opacityOrSize}`}
              value={testOpacity}
              range={[0, 1]}
              step={0.05}
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
            invertMap={invertMap}
            colorMapRange={colorMapRange}
            filterRange={filterRange}
            ballSize={ballSize}
            camera={this.camera}
            scalarField={scalarField}
            trainingOpacity={trainingOpacity}
            testOpacity={testOpacity}
          />
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

  const settings = getServerSettings(state);
  props['deployment'] = settings['deployment'];

  return props;
}

export default connect(mapStateToProps)(ActiveLearningContainer);
