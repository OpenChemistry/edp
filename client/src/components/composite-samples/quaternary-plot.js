import React, {Component} from 'react';
import { throttle } from 'lodash-es';

import { QuaternaryPlot } from 'composition-plot';

import { DataProvider } from 'composition-plot';

class QuaternaryPlotComponent extends Component {

  compositionElement;
  quaternaryPlot;
  dp;

  constructor(props) {
    super(props);

    this.onColorMapChange = throttle(this.onColorMapChange, 500, {leading: false});
  }

  componentDidMount() {
    const { onSampleDeselect, onSampleSelect } = this.props;
    this.dp = new DataProvider([], 4);
    this.quaternaryPlot = new QuaternaryPlot(this.compositionElement, this.dp);
    this.quaternaryPlot.setCallBacks(onSampleSelect, onSampleDeselect);

    this.onNewSamples();
  }

  componentDidUpdate(prevProps) {
    const { samples, compositionSpace, selectedSampleKeys, scalarField, activeMap, colorMapRange  } = this.props;
    this.quaternaryPlot.setSelectedSamples( selectedSampleKeys );

    if (samples !== prevProps.samples) {
      this.dp.setData(samples);
      this.quaternaryPlot.dataUpdated();
    }

    if (JSON.stringify(compositionSpace) !== JSON.stringify(prevProps.compositionSpace)) {
      this.dp.setActiveAxes(compositionSpace);
      this.quaternaryPlot.dataUpdated();
    }

    if (scalarField !== prevProps.scalarField) {
      this.onScalarChange();
      this.quaternaryPlot.dataUpdated();
    }

    if (
      activeMap !== prevProps.activeMap ||
      colorMapRange[0] !== prevProps.colorMapRange[0] ||
      colorMapRange[1] !== prevProps.colorMapRange[1]
    ) {
      this.onColorMapChange();
      this.quaternaryPlot.dataUpdated();
    }
  }

  onNewSamples() {
    const { samples, compositionSpace } = this.props;
    this.dp.setData(samples);
    // Force axes to span [0, 1] regardless of the samples
    const axes = this.dp.getAxes(true);
    for (let key of Object.keys(axes)) {
      axes[key] = {...axes[key], range: [0, 1], spacing: 0.1};
    }
    this.dp.setAxes(axes);

    this.dp.setActiveAxes(compositionSpace);

    this.onScalarChange();
    this.quaternaryPlot.dataUpdated();
  }

  onScalarChange() {
    const { scalarField } = this.props;
    this.dp.setActiveScalar(scalarField);
    this.onColorMapChange();
  }

  onColorMapChange() {
    const { activeMap, colorMapRange, colorMaps } = this.props;
    const colorMap = colorMaps[activeMap];
    this.quaternaryPlot.setColorMap(colorMap, colorMapRange);
  }

  render() {
    return (
        <div style={{width: '100%', height: '22.5rem', position: 'relative', overflowX: 'scroll', overflowY: 'hidden'}}>
          <div style={{width: '70rem', height: '100%'}}>
            <svg style={{width: '100%', height: '100%'}} ref={(ref)=>{this.compositionElement = ref;}}></svg>
          </div>
        </div>
    );
  }
}

export default QuaternaryPlotComponent;
