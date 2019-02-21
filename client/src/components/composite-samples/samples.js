import React, {Component} from 'react';

import { QuaternaryPlot, colors } from 'composition-plot';

import { DataProvider } from 'composition-plot';

class QuaternaryPlotComponent extends Component {

  compositionElement;
  quaternaryPlot;

  constructor(props) {
    super(props);

    this.colorMaps = {
      'Viridis': colors.viridis,
      'Plasma': colors.plasma,
      'Red White Blue': colors.redWhiteBlue,
      'Green Blue': [[0, 1, 0], [0, 0, 1]],
    }
  }

  componentDidMount() {
    const { onSampleDeselect, onSampleSelect } = this.props;
    this.dp = new DataProvider([], 4);
    this.quaternaryPlot = new QuaternaryPlot(this.compositionElement, this.dp);
    this.quaternaryPlot.setCallBacks(onSampleSelect, onSampleDeselect);

    const { samples } = this.props;
    this.onNewSamples(samples);
  }

  componentDidUpdate(prevProps) {
    const { selectedSampleKeys, scalarField, activeMap, colorMapRange  } = this.props;
    this.quaternaryPlot.setSelectedSamples( selectedSampleKeys );

    if (scalarField !== prevProps.scalarField) {
      this.onScalarChange(scalarField);
    }

    if (
      activeMap !== prevProps.activeMap ||
      colorMapRange[0] !== prevProps.colorMapRange[0] ||
      colorMapRange[1] !== prevProps.colorMapRange[1]
    ) {
      this.onColorMapChange(activeMap);
    }
  }

  onNewSamples(samples) {
    const { activeMap, onParamChanged} = this.props;
    let { scalarField, colorMapRange } = this.props;
    this.dp.setData(samples);
    // Force axes to span [0, 1] regardless of the samples
    const axes = this.dp.getAxes();
    for (let key of Object.keys(axes)) {
      axes[key] = {...axes[key], range: [0, 1]};
    }
    this.dp.setAxes(axes);
    scalarField = this.dp.getDefaultScalar(scalarField);
    this.dp.setActiveScalar(scalarField);
    const dataRange = this.dp.getScalarRange(scalarField);
    colorMapRange = [
      Math.min(Math.max(colorMapRange[0], dataRange[0]), dataRange[1] - 1e-6),
      Math.max(Math.min(colorMapRange[1], dataRange[1]), dataRange[0] + 1e-6)
    ];
    const colorMap = this.colorMaps[activeMap];
    this.quaternaryPlot.setColorMap(colorMap, colorMapRange);
    this.quaternaryPlot.dataUpdated();
    onParamChanged({
      scalarField,
      colorMapRange
    });
  }

  onScalarChange(scalarField) {
    const { activeMap, onParamChanged} = this.props;
    let { colorMapRange } = this.props;
    this.dp.setActiveScalar(scalarField);
    const dataRange = this.dp.getScalarRange(scalarField);
    colorMapRange = [...dataRange];
    const colorMap = this.colorMaps[activeMap];
    this.quaternaryPlot.setColorMap(colorMap, colorMapRange);
    onParamChanged({
      scalarField,
      colorMapRange
    });
  }

  onColorMapChange(activeMap) {
    const { onParamChanged, colorMapRange } = this.props;
    let colorMap = this.colorMaps[activeMap];
    this.quaternaryPlot.setColorMap(colorMap, colorMapRange);
    onParamChanged({activeMap});
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
