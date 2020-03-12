import React, {Component} from 'react';
import { throttle, get, isNil } from 'lodash-es';

import { withTheme } from '@material-ui/core';

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
    const { compositionToPosition, compositionSpace, theme } = this.props;
    this.dp = new DataProvider();
    this.multidimensionalPlot = new MultidimensionalPlot(this.plotElement, this.dp, compositionToPosition);
    this.multidimensionalPlot.setCompositionSpace(compositionSpace);
    const bgColor = get(theme, 'palette.background.default', '#efefef');
    this.multidimensionalPlot.setBackground(bgColor);
    this.onNewSamples();
    this.onCameraChange();
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.multidimensionalPlot.resize();
  }

  componentDidUpdate(prevProps) {
    const {samples, scalarField, activeMap, invertMap, colorMapRange, filterRange, camera, trainingOpacity, testOpacity, ballSize, compositionSpace, compositionToPosition, darkMode, theme} = this.props;

    if (darkMode !== prevProps.darkMode) {
      const bgColor = get(theme, 'palette.background.default', '#efefef');
      this.multidimensionalPlot.setBackground(bgColor);
    }

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

    if (invertMap !== prevProps.invertMap) {
      this.onInvertChange();
    }

    if (
      filterRange[0] !== prevProps.filterRange[0] ||
      filterRange[1] !== prevProps.filterRange[1]
    ) {
      this.onFilterRangeChange();
      this.multidimensionalPlot.dataUpdated();
    }

    if (compositionSpace !== prevProps.compositionSpace) {
      this.multidimensionalPlot.setCompositionSpace(compositionSpace);
      this.multidimensionalPlot.dataUpdated();
    }

    if (compositionToPosition !== prevProps.compositionToPosition) {
      this.multidimensionalPlot.setCompositionToPosition(compositionToPosition);
      this.multidimensionalPlot.dataUpdated();
    }

    if (trainingOpacity !== prevProps.trainingOpacity || testOpacity !== prevProps.testOpacity || ballSize !== prevProps.ballSize) {
      this.onOpacityChange();
    }

    if (camera !== prevProps.camera) {
      this.onCameraChange();
    }
  }

  onNewSamples() {
    const { samples } = this.props;
    this.dp.setData(samples);
    this.onScalarChange();
    this.onOpacityChange();
    this.onInvertChange();
    this.multidimensionalPlot.dataUpdated();
  }

  onCameraChange() {
    const { camera } = this.props;
    if (camera) {
      this.multidimensionalPlot.setCamera(camera, true, true);
    }
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

  onInvertChange() {
    const { invertMap } = this.props;
    this.multidimensionalPlot.setInverted(invertMap);
  }

  onFilterRangeChange(range) {
    this.onNewFilter(range);
    this.multidimensionalPlot.dataUpdated();
  }

  onOpacityChange() {
    const {trainingOpacity, testOpacity, ballSize} = this.props;
    const scale = isNil(ballSize) ? 1.5 : ballSize;
    let opacityFn;
    if (!isNil(trainingOpacity) && !isNil(testOpacity)) {
      opacityFn = (sample) => scale * ( sample.isTraining ? trainingOpacity : testOpacity );
    } else {
      opacityFn = () => scale;
    }
    this.multidimensionalPlot.setRadiusFn(opacityFn);
  }

  render() {
    return (
      <div
        style={{width: '100%', height: '22.5rem', position: 'relative', overflow: 'hidden'}}
        ref={(ref) => {this.plotElement = ref;}}
      >
      </div>
    );
  }
}

export default withTheme(MultidimensionPlotComponent);
