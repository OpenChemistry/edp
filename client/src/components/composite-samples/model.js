import React, { useState, Fragment } from 'react';

import { Typography } from '@material-ui/core';

import ModelMetricsComponent from './model-metrics';
import CompositionPlot from './composition-plot';
import ControlsGrid from './controls/grid';
import SelectControlComponent from './controls/select';
import SliderControlComponent from './controls/slider';
import SearchPending from '../search/pending';

const ModelComponent = ({
  compositionPlot, compositionToPosition, compositionSpace, dataRange,
  colorMaps, activeMap, colorMapRange, filterRange, camera,
  scalarField, samples, samplesCompare, metrics, pending
}) => {
  const [metricsType, setMetricsType] = useState('MAE');
  const [iteration, setInteration] = useState(0);

  const delta = dataRange[1] - dataRange[0];

  if (pending) {
    return <SearchPending/>;
  }

  return (
    <Fragment>
      <ModelMetricsComponent
        metrics={metrics}
        mlModelMetric={metricsType}
        scalarField={scalarField}
        nIterations={Object.keys(metrics).length}
        // onParamChanged={this.onParamChanged}
      />
      <ControlsGrid>
        <SelectControlComponent
          gridsize={{xs: 4, sm: 3, md: 2}}
          label="Metrics"
          value={metricsType}
          options={['MAE', 'RMSE']}
          onChange={(metricsType) => {setMetricsType(metricsType)}}
        />
        <SliderControlComponent
          gridsize={{xs: 8, sm: 9, md: 10}}
          label="Model iteration"
          value={iteration}
          range={[0, Object.keys(metrics).length - 1]}
          step={1}
          onChange={(iteration) => {setInteration(iteration)}}
        />
      </ControlsGrid>
      {samples[iteration] &&
      <Fragment>
        <Typography variant='title' style={{textAlign: 'center'}}>
          Model
        </Typography>
        <CompositionPlot
          samples={samples[iteration]}
          compositionPlot={compositionPlot}
          compositionToPosition={compositionToPosition}
          compositionSpace={compositionSpace}
          scalarField={scalarField}
          colorMaps={colorMaps}
          activeMap={activeMap}
          colorMapRange={colorMapRange}
          filterRange={filterRange}
          selectedSampleKeys={new Set()}
          camera={camera}
        />
      </Fragment>
      }

      {samplesCompare[iteration] &&
      <Fragment>
        <Typography variant='title' style={{textAlign: 'center'}}>
          Difference
        </Typography>
        <CompositionPlot
          samples={samplesCompare[iteration]}
          compositionPlot={compositionPlot}
          compositionToPosition={compositionToPosition}
          compositionSpace={compositionSpace}
          scalarField={scalarField}
          colorMaps={colorMaps}
          activeMap='Red White Blue'
          colorMapRange={[-delta, delta]}
          filterRange={filterRange}
          selectedSampleKeys={new Set()}
          camera={camera}
        />
      </Fragment>
      }
    </Fragment>
  );
}

export default ModelComponent;
