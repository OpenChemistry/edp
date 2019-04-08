import React, { Component } from 'react';
import { isNil } from 'lodash-es';
import { Spectrum, Da } from 'composition-plot';
import { ArrayDataProvider } from 'composition-plot/dist/data-provider/spectrum';

class ModelMetricsComponent extends Component {

  plotElement;
  plot;

  componentDidMount() {
    const yOffset = 0;
    this.plot = new Spectrum(this.plotElement);
    this.plot.setOffset(yOffset);
    // this.plot.setShowPoints(true);
    this.updatePlot();
  }

  componentDidUpdate(prevProps) {
    let doUpdate = true;

    if (doUpdate) {
      this.updatePlot();
    }
  }

  onSelect = (i, d) => {
    const {onParamChanged} = this.props;
    onParamChanged('mlModelIteration', i);
  }

  updatePlot() {
    const {metrics, mlModelMetric, scalarField, nIterations} = this.props;

    const x = [];
    const y = [];
    for (let i = 0; i < nIterations; ++i) {
      x.push(i);
      if (isNil(metrics[i])) {
        y.push(-1);
      } else {
        y.push(metrics[i][mlModelMetric][scalarField]);
      }
    }

    const dp = new ArrayDataProvider();
    dp.setArray('x', x);
    dp.setArray('y', y);
    dp.setLabel('x', 'Iteration');
    dp.setLabel('y', mlModelMetric);

    // this.plot.setOnSelect(this.onSelect);
    this.plot.setSpectra([{spectrum: dp, sample: null}]);
    this.plot.setAxes('x', 'y');
  }

  render() {
    return (
      <div style={{width: '100%', height: '10rem', position: 'relative'}}>
        <svg style={{width: '100%', height: '100%'}} ref={(ref)=>{this.plotElement = ref;}}></svg>
      </div>
    )
  }
};

export default ModelMetricsComponent;
