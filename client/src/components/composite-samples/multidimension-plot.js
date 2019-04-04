import React, {Component} from 'react';

import { MultidimensionalPlot } from 'composition-plot';
import { DataProvider } from 'composition-plot/dist/data-provider/multidimensional';

import { colors } from 'composition-plot';

class MultidimensionPlotComponent extends Component {

  compositionToPosition;
  multidimensionalPlot;
  plotElement;
  dp;

  componentDidMount() {
    const { compositionToPosition, samples } = this.props;
    this.dp = new DataProvider();
    this.multidimensionalPlot = new MultidimensionalPlot(this.plotElement, this.dp, compositionToPosition);
    this.onNewSamples(samples);
  }

  componentDidUpdate(prevProps) {
    const {samples, scalarField, activeMap, colorMapRange, filterRange} = this.props;

    if (samples !== prevProps.samples) {
      this.dp.setData(samples);
      this.multidimensionalPlot.dataUpdated();
    }

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

    if (
      filterRange[0] !== prevProps.filterRange[0] ||
      filterRange[1] !== prevProps.filterRange[1]
    ) {
      this.onFilterRangeChange(activeMap);
    }


  }

  onNewSamples(samples) {
    samples = samples || [];
    const { activeMap, onParamChanged, colorMaps } = this.props;
    let { scalarField, colorMapRange, filterRange } = this.props;
    this.dp.setData(samples);
    scalarField = this.dp.getDefaultScalar(scalarField);
    this.dp.setActiveScalar(scalarField);
    const dataRange = this.dp.getScalarRange(scalarField);
    colorMapRange = [
      Math.min(Math.max(colorMapRange[0], dataRange[0]), dataRange[1] - 1e-6),
      Math.max(Math.min(colorMapRange[1], dataRange[1]), dataRange[0] + 1e-6)
    ];
    filterRange = [
      Math.min(Math.max(filterRange[0], dataRange[0]), dataRange[1]),
      Math.max(Math.min(filterRange[1], dataRange[1]), dataRange[0])
    ];
    const colorMap = colorMaps[activeMap];
    this.multidimensionalPlot.setColorMap(colorMap, colorMapRange);
    this.onNewFilter(filterRange)
    this.multidimensionalPlot.dataUpdated();
    this.setState({...this.state, dataRange});
    onParamChanged({
      scalarField,
      colorMapRange
    });
  }

  onNewFilter(range) {
    let filter = function(sample) {
      const val = DataProvider.getSampleScalar(sample, this.getActiveScalar());
      return range[0] <= val && val <= range[1];
    };
    filter = filter.bind(this.dp);
    this.dp.setFilter(filter);
  }

  onScalarChange(scalarField) {
    const { activeMap, onParamChanged, colorMaps } = this.props;
    this.dp.setActiveScalar(scalarField);
    const dataRange = this.dp.getScalarRange(scalarField);
    let colorMapRange = [...dataRange];
    let filterRange = [...dataRange];
    const colorMap = colorMaps[activeMap];
    this.multidimensionalPlot.activeScalarsUpdated();
    this.multidimensionalPlot.setColorMap(colorMap, colorMapRange);
    this.onNewFilter(filterRange);
    this.multidimensionalPlot.dataUpdated();
    onParamChanged({
      scalarField,
      colorMapRange,
      filterRange
    });
  }

  onColorMapChange(activeMap) {
    const { onParamChanged, colorMapRange, colorMaps } = this.props;
    let colorMap = colorMaps[activeMap];
    this.multidimensionalPlot.setColorMap(colorMap, colorMapRange);
    onParamChanged({activeMap});
  }

  onFilterRangeChange(range) {
    // const { onParamChanged } = this.props;

    this.onNewFilter(range);
    this.multidimensionalPlot.dataUpdated();

    // onParamChanged({filterRange: range});
  }

  render() {
    return (
      <div
        style={{width: '100%', height: '40rem', position: 'relative', overflow: 'hidden'}}
        ref={(ref) => {this.plotElement = ref;}}
      >
      </div>
    );
  }
}

export default MultidimensionPlotComponent;
