import React, { useState, Fragment } from 'react';

import { Typography, Divider, withStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

import ModelInfo from './model-info';
import ModelMetricsComponent from './model-metrics';
import CompositionPlot from './composition-plot';
import ControlsGrid from './controls/grid';
import SelectControlComponent from './controls/select';
import SliderControlComponent from './controls/slider';
import SearchPending from '../search/pending';

const styles = (theme) => ({
  evenModel: {
    backgroundColor: grey[200]
  },
  oddModel: {
    backgroundColor: theme.palette.background
  }
});

const ModelComponent = ({
  compositionPlot, compositionToPosition, compositionSpace, dataRange,
  colorMaps, activeMap, invertMap, colorMapRange, filterRange, camera,
  scalarField, samples, samplesCompare, metrics, pending,
  model, parameters, modelNumber, classes, testOpacity, trainingOpacity, ballSize
}) => {
  const [metricsType, setMetricsType] = useState('MAE');
  const [iteration, setInteration] = useState(0);

  const delta = dataRange[1] - dataRange[0];

  if (pending) {
    return <SearchPending/>;
  }

  return (
    <div className={modelNumber % 2 === 0 ? classes.evenModel : classes.oddModel}>
      <Divider/>
      <br/>
      <ModelInfo
        model={model}
        parameters={parameters}
      />
      <ModelMetricsComponent
        metrics={metrics}
        mlModelMetric={metricsType}
        scalarField={scalarField}
        nIterations={Object.keys(metrics).length}
        onChange={(iteration) => {setInteration(iteration)}}
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
          trainingOpacity={trainingOpacity}
          testOpacity={testOpacity}
          ballSize={ballSize}
          scalarField={scalarField}
          colorMaps={colorMaps}
          activeMap={activeMap}
          invertMap={invertMap}
          colorMapRange={colorMapRange}
          filterRange={filterRange}
          selectedSampleKeys={new Set()}
          showLegend={true}
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
          trainingOpacity={trainingOpacity}
          testOpacity={testOpacity}
          ballSize={ballSize}
          scalarField={scalarField}
          colorMaps={colorMaps}
          activeMap='bwr'
          colorMapRange={[-delta, delta]}
          filterRange={filterRange}
          selectedSampleKeys={new Set()}
          showLegend={true}
          camera={camera}
        />
      </Fragment>
      }
    </div>
  );
}

export default withStyles(styles)(ModelComponent);
