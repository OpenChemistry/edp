import React, {Component} from 'react';
import { throttle, isNil } from 'lodash-es';

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
    this.dp = new DataProvider(4);
    this.quaternaryPlot = new QuaternaryPlot(this.compositionElement, this.dp);
    this.quaternaryPlot.setCallBacks(onSampleSelect, onSampleDeselect);
    this.onDarkModeChange();
    this.onNewSamples();
  }

  componentDidUpdate(prevProps) {
    const {
      samples, compositionSpace, selectedSampleKeys,
      scalarField, activeMap, invertMap, colorMapRange,
      trainingOpacity, testOpacity, darkMode
    } = this.props;
    this.quaternaryPlot.setSelectedSamples( selectedSampleKeys );

    let redraw = false;

    if (darkMode !== prevProps.darkMode) {
      this.onDarkModeChange();
      redraw = true;
    }

    if (samples !== prevProps.samples) {
      this.dp.setData(samples);
      this.fixPlotAxes();
      this.dp.setActiveAxes(compositionSpace);
      redraw = true;
    }

    if (JSON.stringify(compositionSpace) !== JSON.stringify(prevProps.compositionSpace)) {
      this.dp.setActiveAxes(compositionSpace);
      redraw = true;
    }

    if (scalarField !== prevProps.scalarField) {
      this.onScalarChange();
      redraw = true;
    }

    if (
      activeMap !== prevProps.activeMap ||
      colorMapRange[0] !== prevProps.colorMapRange[0] ||
      colorMapRange[1] !== prevProps.colorMapRange[1]
    ) {
      this.onColorMapChange();
      redraw = true;
    }

    if (trainingOpacity !== prevProps.trainingOpacity || testOpacity !== prevProps.testOpacity) {
      this.onOpacityChange();
    }

    if (invertMap !== prevProps.invertMap) {
      this.quaternaryPlot.setInverted(invertMap);
      redraw = true;
    }

    if (redraw) {
      this.quaternaryPlot.dataUpdated();
    }
  }

  fixPlotAxes() {
    // Force axes to span [0, 1] regardless of the samples
    const axes = this.dp.getAxes(true);
    for (let key of Object.keys(axes)) {
      let spacing = axes[key].spacing;
      // Clamp spacing
      spacing = 1/Math.round(1/spacing);
      axes[key] = {...axes[key], range: [0, 1], spacing};
    }
    this.dp.setAxes(axes);
  }

  onNewSamples() {
    const { samples, compositionSpace } = this.props;
    this.dp.setData(samples);
    this.fixPlotAxes();

    this.dp.setActiveAxes(compositionSpace);

    this.onScalarChange();
    this.onOpacityChange();

    this.quaternaryPlot.dataUpdated();
  }

  onDarkModeChange() {
    const { darkMode } = this.props;
    const textColor = darkMode ? [1, 1, 1] : [0, 0, 0];
    this.quaternaryPlot.setTextColor(textColor);
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

  onOpacityChange() {
    const {trainingOpacity, testOpacity} = this.props;
    let opacityFn;
    if (!isNil(trainingOpacity) && !isNil(testOpacity)) {
      opacityFn = (sample) => sample.isTraining ? trainingOpacity : testOpacity;
    } else {
      opacityFn = () => 1.0;
    }
    this.quaternaryPlot.setOpacityFn(opacityFn);
  }

  render() {
    return (
        <div style={{position: 'relative', overflowX: 'scroll', overflowY: 'hidden'}}>
          <svg ref={(ref)=>{this.compositionElement = ref;}}></svg>
        </div>
    );
  }
}

export default QuaternaryPlotComponent;
