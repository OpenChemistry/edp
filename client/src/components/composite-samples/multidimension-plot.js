import React, {Component} from 'react';
import { throttle } from 'lodash-es';

import { MultidimensionalPlot } from 'composition-plot';
import { DataProvider } from 'composition-plot/dist/data-provider/multidimensional';

class MultidimensionPlotComponent extends Component {

  compositionToPosition;
  multidimensionalPlot;
  plotElement;
  dp;

  constructor(props) {
    super(props);

    this.onColorMapChange = throttle(this.onColorMapChange, 500, {leading: false});
    this.onFilterRangeChange = throttle(this.onFilterRangeChange, 500, {leading: false});
  }

  componentDidMount() {
    const { compositionToPosition } = this.props;
    this.dp = new DataProvider();
    this.multidimensionalPlot = new MultidimensionalPlot(this.plotElement, this.dp, compositionToPosition);
    this.onNewSamples();
  }

  componentDidUpdate(prevProps) {
    const {samples, scalarField, activeMap, colorMapRange, filterRange} = this.props;

    if (samples !== prevProps.samples) {
      this.dp.setData(samples);
      this.multidimensionalPlot.dataUpdated();
    }

    if (scalarField !== prevProps.scalarField) {
      this.onScalarChange();
      this.multidimensionalPlot.dataUpdated();
    }

    if (
      activeMap !== prevProps.activeMap ||
      colorMapRange[0] !== prevProps.colorMapRange[0] ||
      colorMapRange[1] !== prevProps.colorMapRange[1]
    ) {
      this.onColorMapChange();
      this.multidimensionalPlot.dataUpdated();
    }

    if (
      filterRange[0] !== prevProps.filterRange[0] ||
      filterRange[1] !== prevProps.filterRange[1]
    ) {
      this.onFilterRangeChange();
      this.multidimensionalPlot.dataUpdated();
    }
  }

  onNewSamples() {
    const { samples } = this.props;
    this.dp.setData(samples);
    this.onScalarChange();
    this.multidimensionalPlot.dataUpdated();
  }

  onNewFilter(range) {
    let filter = function(sample) {
      const val = DataProvider.getSampleScalar(sample, this.getActiveScalar());
      return range[0] <= val && val <= range[1];
    };
    filter = filter.bind(this.dp);
    this.dp.setFilter(filter);
  }

  onScalarChange() {
    const { scalarField } = this.props;
    this.dp.setActiveScalar(scalarField);
    this.onColorMapChange();
  }

  onColorMapChange() {
    const { activeMap, colorMapRange, colorMaps } = this.props;
    let colorMap = colorMaps[activeMap];
    this.multidimensionalPlot.setColorMap(colorMap, colorMapRange);
  }

  onFilterRangeChange(range) {
    this.onNewFilter(range);
    this.multidimensionalPlot.dataUpdated();
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
