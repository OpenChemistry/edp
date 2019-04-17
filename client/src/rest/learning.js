import girderClient from '@openchemistry/girder-client';
import { isNil } from 'lodash-es';

export function getModelMetadata() {
  return new Promise((resolve, _reject) => {
    const modelMetadata = [
      {
        fileName: 'pull.py',
        name: 'PullPy',
        parameters: {
          a: {
            label: 'A',
            type: 'number',
            default: 2,
            min: 0,
            max: 12,
            step: 1
          },
          b: {
            label: 'B',
            type: 'number',
            default: 5,
            options: [3, 5, 7, 9]
          },
          c: {
            label: 'C',
            type: 'string',
            default: 'foo',
            options: ['foo', 'bar', 'baz']
          }
        }
      },
      {
        fileName: 'stem.py',
        name: 'StemPy',
        parameters: {
          a: {
            label: 'A',
            type: 'number',
            default: 1,
            min: -2,
            max: 3,
            step: 0.5
          },
          c: {
            label: 'C',
            type: 'string',
            default: 'foo',
            options: ['foo', 'bar', 'baz']
          }
        }
      }
    ];
    resolve(modelMetadata);
  });
}

export function runModel(samples, model, parameters) {
  return new Promise((resolve, _reject) => {
    const result = {
      model,
      samples: {},
      samplesCompare: {},
      metrics: {}
    };

    const nIterations = 20;

    for (let modelIteration = 0; modelIteration < nIterations; ++modelIteration) {
      const delta = 40 * (1 - (0.7 + Math.random() * 0.3)  * (modelIteration / nIterations));

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

      const metrics = calculateMetrics(samples, modelSamples);

      result.samples[modelIteration] = modelSamples;
      result.samplesCompare[modelIteration] = modelCompareSamples;
      result.metrics[modelIteration] = metrics;
    }

    resolve(result);
  });
}

const calculateMetrics = (samples, modelSamples) => {
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
