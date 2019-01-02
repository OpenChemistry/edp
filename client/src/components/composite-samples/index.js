import React, {Component} from 'react';
import { has } from 'lodash-es';
import {
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TextField,
  Button
} from '@material-ui/core';
import { Slider} from '@material-ui/lab';

import { QuaternaryPlot, colors } from 'composition-plot';

import { DataProvider } from 'composition-plot';

class PlotComponentContainer extends Component {

  compositionElement;
  quaternaryPlot;

  constructor(props) {
    super(props);
    this.state = {
      dataRange: [0, 1],
      colorMap: colors.viridis,
      colorMapRange: [0, 1],
      activeMap: 'Viridis'
    }

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

  componentDidUpdate() {
    const { selectedSampleKeys } = this.props;
    this.quaternaryPlot.setSelectedSamples( selectedSampleKeys );
  }

  onNewSamples(samples) {
    const { scalarField, onParamChanged} = this.props;
    this.dp.setData(samples);
    // Force axes to span [0, 1] regardless of the samples
    const axes = this.dp.getAxes();
    for (let key of Object.keys(axes)) {
      axes[key] = {...axes[key], range: [0, 1]};
    }
    this.dp.setAxes(axes);
    const scalar = this.dp.getDefaultScalar(scalarField);
    this.dp.setActiveScalar(scalar);
    const dataRange = this.dp.getScalarRange(scalar);
    const colorMapRange = [...dataRange];

    this.quaternaryPlot.setColorMap(this.state.colorMap, dataRange);
    this.quaternaryPlot.dataUpdated();
    this.setState({...this.state, colorMapRange, dataRange});
    onParamChanged({
      'scalarField': scalar
    });
  }

  onScalarChange(scalar) {
    this.dp.setActiveScalar(scalar);
    const dataRange = this.dp.getScalarRange(scalar);
    const colorMapRange = [...dataRange];
    this.quaternaryPlot.setColorMap(this.state.colorMap, dataRange);
    this.props.onParamChanged({
      'scalarField': scalar
    });
    this.setState({...this.state, colorMapRange, dataRange});
  }

  onColorMapChange(activeMap) {
    let colorMap = this.colorMaps[activeMap];
    this.quaternaryPlot.setColorMap(colorMap, this.state.colorMapRange);
    this.setState({...this.state, colorMap, activeMap});
  }

  onColorMapRangeChange(value, index) {
    const otherIndex = index === 0 ? 1 : 0;
    if (index === 0) {
      if (value >= this.state.colorMapRange[otherIndex]) {
        return;
      }
    } else {
      if (value <= this.state.colorMapRange[otherIndex]) {
        return;
      }
    }
    const range = [...this.state.colorMapRange];
    range[index] = value;
    this.setState({...this.state, colorMapRange: range});
    this.quaternaryPlot.setColorMap(this.state.colorMap, range);
  }

  render() {
    const { scalarField, onClearSelection, selectedSamples, onSampleSelectById } = this.props;
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
                    value={this.state.activeMap || ""}
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
                    {this.state.colorMapRange[0].toFixed(3)}
                  </div>
                  <div style={{flexGrow: 1, paddingRight: 16}}>
                    <Slider 
                      aria-labelledby="map-range-label"
                      min={this.state.dataRange[0]} max={this.state.dataRange[1]} step={0.001}
                      value={this.state.colorMapRange[0]}
                      onChange={(e, val) => {this.onColorMapRangeChange(val, 0)}}
                    />
                    <Slider
                      min={this.state.dataRange[0]} max={this.state.dataRange[1]} step={0.001}
                      value={this.state.colorMapRange[1]}
                      onChange={(e, val) => {this.onColorMapRangeChange(val, 1)}}
                    />
                  </div>
                  <div>
                    {this.state.colorMapRange[1].toFixed(3)}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div style={{width: '100%', height: '22.5rem', position: 'relative', overflowX: 'scroll', overflowY: 'hidden'}}>
          <div style={{width: '70rem', height: '100%'}}>
            <svg style={{width: '100%', height: '100%'}} ref={(ref)=>{this.compositionElement = ref;}}></svg>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Selected samples</TableCell>
              <TableCell>Add to selection</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <div style={{minWidth: '40rem', display: 'flex'}}>
                  <TextField fullWidth
                    disabled
                    value={selectedSamples.map(sample => sample.sampleNum).join(', ')}
                  ></TextField>
                  <Button onClick={onClearSelection}>Clear</Button>
                </div>
              </TableCell>
              <TableCell>
                <TextField
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      onSampleSelectById(e.target.value);
                      e.target.value = '';
                    }
                  }}
                ></TextField>
                {/* <Button>Add</Button> */}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

      </div>
    );
  }
}

export default PlotComponentContainer;
