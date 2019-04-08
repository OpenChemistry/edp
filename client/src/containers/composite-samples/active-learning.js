import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { produce } from 'immer';

import { parseUrlMatch } from '../../nodes';

import QuaternaryPlotComponent from '../../components/composite-samples/quaternary-plot';

import NotFoundPage from '../../components/notFound.js';
import { colors } from 'composition-plot';
import { NearestCompositionToPositionProvider, AnaliticalCompositionToPositionProvider } from 'composition-plot';
import { isNil } from 'lodash-es';
import ModelMetricsComponent from '../../components/composite-samples/model-metrics';
import MultidimensionPlotComponent from '../../components/composite-samples/multidimension-plot';
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
import SliderControlComponent from '../../components/composite-samples/controls/slider';

const URL_PARAMS = {
  compositionPlot: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, '2d')
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
  filterRange: {
    serialize: defaultWrapper(arraySerialize, null),
    deserialize: defaultWrapper(arrayDeserialize, [0, 1])
  },
  mlModel: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, ''),
    callback: function(currValue, nextValue) {
      const { mlModels } = this.state;

      if (isNil(mlModels[nextValue])) {
        return;
      }

      const model = mlModels[nextValue];
      const mlModelIteration = model.nIterations - 1;

      // If we already fetched the requested ML Model, do nothing
      if (this.state.mlModels[nextValue].samples[mlModelIteration]) {
        return;
      }

      this.fetchMachineLearningModel(nextValue);

      setTimeout(() => {this.onParamChanged('mlModelIteration', mlModelIteration);}, 100);
    }
  },
  mlModelIteration: {
    serialize: defaultWrapper(numberSerialize, null),
    deserialize: defaultWrapper(numberDeserialize, 0),
    callback: function(currValue, nextValue) {
      const { mlModel } = this.props;
      const { mlModels } = this.state;

      if (isNil(mlModels[nextValue])) {
        return;
      }

      if (mlModels[mlModel].samples[nextValue]) {
        return;
      }
      // this.fetchMachineLearningModel(mlModel, nextValue);
    }
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
      quatCompositionToPosition: new AnaliticalCompositionToPositionProvider(),
      octCompositionToPosition: null,
      mlModels: {
        'Model 1': {
          nIterations: 50,
          samples: {},
          samplesCompare: {},
          metrics: {}
        },
        'Model 2': {
          nIterations: 50,
          samples: {},
          samplesCompare: {},
          metrics: {}
        },
        'Model 3': {
          nIterations: 50,
          samples: {},
          samplesCompare: {},
          metrics: {}
        },
        'Model 4': {
          nIterations: 50,
          samples: {},
          samplesCompare: {},
          metrics: {}
        },
      },
      scalarFields: [],
      dataRange: [0, 1]
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

  fetchMachineLearningModel = (modelName) => {
    const {samples} = this.props;

    const model = this.state.mlModels[modelName];

    for (let modelIteration = 0; modelIteration < model.nIterations; ++modelIteration) {
      const delta = 40 * (1 - (0.7 + Math.random() * 0.3)  * (modelIteration / model.nIterations));

      let modelSamples = [];
      let modelCompareSamples = [];

      for (let i in samples) {
        let sample = samples[i];
        let modelSample = {...sample};
        modelSample.scalars = Object.entries(sample.scalars)
          .map((val) => {
            let [key, value] = val;
            return [key, value - delta / 2 + Math.random() * delta];
          })
          .reduce((accumulator, curr) => {
            return {...accumulator, [curr[0]]: curr[1]};
          }, {});
        modelSamples.push(modelSample);
      }

      for (let i in samples) {
        let sample = samples[i];
        let modelCompareSample = {...sample};
        modelCompareSample.scalars = Object.entries(sample.scalars)
          .map((val) => {
            let [key, value] = val;
            return [key, modelSamples[i].scalars[key] - value];
          })
          .reduce((accumulator, curr) => {
            return {...accumulator, [curr[0]]: curr[1]};
          }, {});
        modelCompareSamples.push(modelCompareSample);
      }

      const metrics = this.calculateMetrics(samples, modelSamples);

      this.setState((state) => {
        return produce(state, (draft) => {
          draft.mlModels[modelName].samples[modelIteration] = modelSamples;
          draft.mlModels[modelName].samplesCompare[modelIteration] = modelCompareSamples;
          draft.mlModels[modelName].metrics[modelIteration] = metrics;
        });
      });

    }
  }

  calculateMetrics = (samples, modelSamples) => {
    const metrics = {
      'MAE': {},
      'RMSE': {}
    };

    const n = samples.length;

    for (let i in samples) {
      let sample = samples[i];
      let modelSample = modelSamples[i];
      for (let scalar in sample.scalars) {
        if (isNil(metrics['MAE'][scalar])) {
          metrics['MAE'][scalar] = 0;
          metrics['RMSE'][scalar] = 0;
        }
        const diff = sample.scalars[scalar] - modelSample.scalars[scalar];
        metrics['MAE'][scalar] += Math.abs(diff);
        metrics['RMSE'][scalar] += diff * diff;
      }
    }

    for (let scalar in metrics['MAE']) {
      metrics['MAE'][scalar] /= n;
    }

    for (let scalar in metrics['RMSE']) {
      metrics['RMSE'][scalar] = Math.sqrt(metrics['RMSE'][scalar] / n);
    }

    return metrics;
  }

  getUrlParams() {
    return URL_PARAMS;
  }

  render() {
    const {
      compositionPlot,
      samples,
      scalarField,
      activeMap,
      colorMapRange,
      filterRange,
      mlModel,
      mlModelIteration,
      mlModelMetric
    } = this.props;

    const {
      quatCompositionToPosition,
      octCompositionToPosition,
      mlModels,
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
          selectedSampleKeys={new Set()}
          onParamChanged={this.onParamChanged}
          onStateParamChanged={this.onStateParamChanged}
          onSampleSelect={this.onSampleSelect}
          onSampleDeselect={this.onSampleDeselect}
        />
        }

        {compositionPlot === '3d' &&
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

        <SelectControlComponent
          label="Model"
          value={mlModel}
          options={['None'].concat(Object.keys(mlModels))}
          onChange={(mlModel) => {this.onParamChanged({mlModel})}}
        />

        {mlModels[mlModel] &&
        <Fragment>
          {mlModels[mlModel].metrics &&
          <ModelMetricsComponent
            metrics={mlModels[mlModel].metrics}
            mlModelMetric={mlModelMetric}
            scalarField={scalarField}
            nIterations={mlModels[mlModel] ? mlModels[mlModel].nIterations : 1}
            onParamChanged={this.onParamChanged}
          />
          }
          <SliderControlComponent
            label="Model iteration"
            value={mlModelIteration}
            range={[0, mlModels[mlModel].nIterations - 1]}
            step={1}
            onChange={(mlModelIteration) => {this.onParamChanged({mlModelIteration})}}
          />
          {mlModels[mlModel].samples[mlModelIteration] &&
          <QuaternaryPlotComponent
            samples={mlModels[mlModel].samples[mlModelIteration]}
            scalarField={scalarField}
            colorMaps={this.colorMaps}
            activeMap={activeMap}
            colorMapRange={colorMapRange}
            selectedSampleKeys={new Set()}
            onParamChanged={() => {}}
            onSampleSelect={() => {}}
            onSampleDeselect={() => {}}
            onStateParamChanged={() => {}}
          />
          }

          {mlModels[mlModel].samplesCompare[mlModelIteration] &&
          <QuaternaryPlotComponent
            samples={mlModels[mlModel].samplesCompare[mlModelIteration]}
            scalarField={scalarField}
            colorMaps={this.colorMaps}
            activeMap='Red White Blue'
            colorMapRange={[-20, 20]}
            selectedSampleKeys={new Set()}
            onParamChanged={() => {}}
            onSampleSelect={() => {}}
            onSampleDeselect={() => {}}
            onStateParamChanged={() => {}}
          />
          }
        </Fragment>
        }
      </div>
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

  return props;
}

export default connect(mapStateToProps)(ActiveLearningContainer);
