import React, { Fragment } from 'react';

import { connect } from 'react-redux';

import { getModelData } from '../../redux/ducks/learning';
import ModelComponent from '../../components/composite-samples/model';

const ModelsContainer = ({
  compositionPlot, compositionToPosition, compositionSpace, dataRange,
  colorMaps, activeMap, invertMap, colorMapRange, filterRange, camera,
  scalarField, models, modelIds, trainingOpacity, testOpacity, ballSize
}) => {
  return models.map((modelData, i) => {
    if (!modelData) {
      return null;
    }
    return (
      <ModelComponent
        key={modelIds[i]}
        modelNumber={i}
        compositionPlot={compositionPlot}
        compositionToPosition={compositionToPosition}
        compositionSpace={compositionSpace}
        dataRange={dataRange}
        colorMaps={colorMaps}
        activeMap={activeMap}
        invertMap={invertMap}
        colorMapRange={colorMapRange}
        filterRange={filterRange}
        ballSize={ballSize}
        camera={camera}
        scalarField={scalarField}
        model={modelData.model}
        parameters={modelData.parameters}
        samples={modelData.samples}
        samplesCompare={modelData.samplesCompare}
        metrics={modelData.metrics}
        pending={modelData.pending}
        trainingOpacity={trainingOpacity}
        testOpacity={testOpacity}
      />
    );
  });
}

function mapStateToProps(state, ownProps) {
  const { modelIds } = ownProps;

  return {
    models: modelIds.map(id => getModelData(state, id))
  }
}

export default connect(mapStateToProps)(ModelsContainer);
