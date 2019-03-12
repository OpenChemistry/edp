import React, { Component } from 'react';

import {
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead
} from '@material-ui/core';
import { Slider} from '@material-ui/lab';

import { MultidimensionalPlot } from 'composition-plot';
import { DataProvider } from 'composition-plot/dist/data-provider/multidimensional';

import { colors } from 'composition-plot';

class MultidimensionComponent extends Component {
  compositionToPosition;
  multidimensionalPlot;
  plotElement;
  dp;

  compositionElement;
  quaternaryPlot;

  constructor(props) {
    super(props);
    this.state = {
      dataRange: [0, 1]
    }

    this.colorMaps = {
      'Viridis': colors.viridis,
      'Plasma': colors.plasma,
      'Red White Blue': colors.redWhiteBlue,
      'Green Blue': [[0, 1, 0], [0, 0, 1]],
    }
  }

  componentDidMount() {
    const { compositionToPosition, samples } = this.props;
    this.dp = new DataProvider();
    this.multidimensionalPlot = new MultidimensionalPlot(this.plotElement, this.dp, compositionToPosition);
    this.onNewSamples(samples);
  }

  componentDidUpdate(prevProps) {
    const {samples} = this.props;
    if (samples !== prevProps.samples) {
      this.onNewSamples(samples);
    }
  }

  onNewSamples(samples) {
    samples = samples || [];
    const { activeMap, onParamChanged} = this.props;
    let { scalarField, colorMapRange } = this.props;
    this.dp.setData(samples);
    scalarField = this.dp.getDefaultScalar(scalarField);
    this.dp.setActiveScalar(scalarField);
    const dataRange = this.dp.getScalarRange(scalarField);
    colorMapRange = [
      Math.min(Math.max(colorMapRange[0], dataRange[0]), dataRange[1] - 1e-6),
      Math.max(Math.min(colorMapRange[1], dataRange[1]), dataRange[0] + 1e-6)
    ];
    const colorMap = this.colorMaps[activeMap];
    this.multidimensionalPlot.setColorMap(colorMap, colorMapRange);
    this.multidimensionalPlot.dataUpdated();
    this.setState({...this.state, dataRange});
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
    this.multidimensionalPlot.activeScalarsUpdated();
    this.multidimensionalPlot.setColorMap(colorMap, colorMapRange);
    onParamChanged({
      scalarField,
      colorMapRange
    });
    this.setState({...this.state, dataRange});
  }

  onColorMapChange(activeMap) {
    const { onParamChanged, colorMapRange } = this.props;
    let colorMap = this.colorMaps[activeMap];
    this.multidimensionalPlot.setColorMap(colorMap, colorMapRange);
    onParamChanged({activeMap});
  }

  onColorMapRangeChange(value, index) {
    const { colorMapRange, activeMap, onParamChanged } = this.props;
    const otherIndex = index === 0 ? 1 : 0;
    if (index === 0) {
      if (value >= colorMapRange[otherIndex]) {
        return;
      }
    } else {
      if (value <= colorMapRange[otherIndex]) {
        return;
      }
    }
    const range = [...colorMapRange];
    range[index] = value;
    onParamChanged({colorMapRange: range});
    this.multidimensionalPlot.setColorMap(this.colorMaps[activeMap], range);
  }

  render() {
    const { scalarField, activeMap, colorMapRange } = this.props;
    const scalars = this.dp ? this.dp.getScalars() : [];

    let scalarSelectOptions = [];
    for (let scalar of scalars) {
      scalarSelectOptions.push(<MenuItem key={scalar} value={scalar}>{scalar.replace('\\u002', '.')}</MenuItem>)
    }

    let colorMapSelectOptions = [];
    for (let name in this.colorMaps) {
      colorMapSelectOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Scalar field</TableCell>
              <TableCell>Color map</TableCell>
              <TableCell>Map range</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor="select-scalar">Scalar</InputLabel> */}
                  <Select
                    value={scalarField || ""}
                    onChange={(e) => {this.onScalarChange(e.target.value)}}
                    inputProps={{name: 'scalar', id: 'select-scalar'}}
                  >
                    {scalarSelectOptions}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor="select-map">Color Map</InputLabel> */}
                  <Select
                    value={activeMap || ""}
                    onChange={(e) => {this.onColorMapChange(e.target.value)}}
                    inputProps={{name: 'colorMap', id: 'select-map'}}
                  >
                    {colorMapSelectOptions}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                  <div>
                    {colorMapRange[0].toFixed(3)}
                  </div>
                  <div style={{flexGrow: 1, paddingRight: 16}}>
                    <Slider 
                      aria-labelledby="map-range-label"
                      min={this.state.dataRange[0]} max={this.state.dataRange[1]} step={0.001}
                      value={colorMapRange[0]}
                      onChange={(e, val) => {this.onColorMapRangeChange(val, 0)}}
                    />
                    <Slider
                      min={this.state.dataRange[0]} max={this.state.dataRange[1]} step={0.001}
                      value={colorMapRange[1]}
                      onChange={(e, val) => {this.onColorMapRangeChange(val, 1)}}
                    />
                  </div>
                  <div>
                    {colorMapRange[1].toFixed(3)}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div
          style={{width: '100%', height: '40rem'}}
          ref={(ref) => {this.plotElement = ref;}}
        >
        </div>

      </div>
    );
  }
}

export default MultidimensionComponent;
