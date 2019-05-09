import girderClient from '@openchemistry/girder-client';
import { isNil } from 'lodash-es';

export function getModelMetadata() {
  return new Promise((resolve, _reject) => {
    const modelMetadata = [
      {
        fileName: 'pull.py',
        name: 'Some Model',
        parameters: {
          a: {
            label: 'Alpha',
            type: 'number',
            default: 0.75,
            min: 0,
            max: 12,
            step: 1
          },
          b: {
            label: 'Beta',
            type: 'number',
            default: 0.5,
            min: 0,
            max: 12,
            step: 1
          },
          c: {
            label: 'Threshold',
            type: 'number',
            default: 15.2,
            min: 0,
            max: 12,
            step: 1
          },
          d: {
            label: 'Interpolation',
            type: 'number',
            default: 3,
            options: [1, 3, 5, 7, 9]
          },
          e: {
            label: 'Max Samples',
            type: 'number',
            default: 2,
            min: 0,
            max: 12,
            step: 1
          },
          f: {
            label: 'Sample Selection',
            type: 'string',
            default: 'random',
            options: ['random', 'average']
          }
        }
      },
      {
        fileName: 'stem.py',
        name: 'Another Model',
        parameters: {
          a: {
            label: 'Alpha',
            type: 'number',
            default: 0.25,
            min: 0,
            max: 12,
            step: 1
          },
          c: {
            label: 'Threshold',
            type: 'number',
            default: 9.4,
            min: 0,
            max: 12,
            step: 1
          },
          d: {
            label: 'Interpolation',
            type: 'number',
            default: 1,
            options: [1, 3, 5, 7, 9]
          },
          f: {
            label: 'Sample Selection',
            type: 'string',
            default: 'average',
            options: ['random', 'average']
          }
        }
      }
    ];
    resolve(modelMetadata);
  });
}

export function runModel(samples, model, parameters) {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      const result = {
        model,
        parameters,
        samples: {},
        samplesCompare: {},
        metrics: {}
      };

      const nIterations = 20;

      for (let modelIteration = 0; modelIteration < nIterations; ++modelIteration) {
        const delta = 5 * (1 - (0.7 + Math.random() * 0.3)  * (modelIteration / nIterations));

        let modelSamples = [];
        let modelCompareSamples = [];

        for (let i in samples) {
          let sample = samples[i];
          let modelSample = {...sample};
          modelSample.fom = sample.fom
            .map(fom => {
              let { value } = fom;
              value = value - delta / 2 + Math.random() * delta;
              return {...fom, value};
            });
          modelSamples.push(modelSample);
        }

        for (let i in samples) {
          let sample = samples[i];
          let modelCompareSample = {...sample};
          modelCompareSample.fom = sample.fom
            .map((fom, j) => {
              let { value } = fom;
              value = modelSamples[i].fom[j].value - value;
              return {...fom, value};
            });
          modelCompareSamples.push(modelCompareSample);
        }

        const metrics = calculateMetrics(samples, modelSamples);

        result.samples[modelIteration] = modelSamples;
        result.samplesCompare[modelIteration] = modelCompareSamples;
        result.metrics[modelIteration] = metrics;
      }

      resolve(result);
    }, 3000);
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
    sample.fom.forEach((fom, j) => {
      const { name, value } = fom;
      if (isNil(metrics['MAE'][name])) {
        metrics['MAE'][name] = 0;
        metrics['RMSE'][name] = 0;
      }
      const diff = value - modelSample.fom[j].value;
      metrics['MAE'][name] += Math.abs(diff);
      metrics['RMSE'][name] += diff * diff;
    });
  }

  for (let scalar in metrics['MAE']) {
    metrics['MAE'][scalar] /= n;
  }

  for (let scalar in metrics['RMSE']) {
    metrics['RMSE'][scalar] = Math.sqrt(metrics['RMSE'][scalar] / n);
  }

  return metrics;
}
