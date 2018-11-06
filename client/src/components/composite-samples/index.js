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
  TableHead
} from '@material-ui/core';
import { Slider} from '@material-ui/lab';

import { QuaternaryPlot, Spectrum, colors } from 'composition-plot';

import { DataProvider } from 'composition-plot';

class PlotComponentContainer extends Component {

  compositionElement;
  spectraElement;
  quaternaryPlot;

  constructor(props) {
    super(props);
    this.state = {
      dataRange: [0, 1],
      colorMap: colors.viridis,
      colorMapRange: [0, 1],
      scalar: null,
      activeMap: 'Viridis',
      selectedSamples: [],
      sampleFields: [],
      xField: null,
      yField: null,
      yOffset: 0
    }

    this.colorMaps = {
      'Viridis': colors.viridis,
      'Plasma': colors.plasma,
      'Red White Blue': colors.redWhiteBlue,
      'Green Blue': [[0, 1, 0], [0, 0, 1]],
    }
  }

  componentDidMount() {
    this.dp = new DataProvider([], 4);
    this.quaternaryPlot = new QuaternaryPlot(this.compositionElement, this.dp);
    this.quaternaryPlot.setCallBacks(this.onSampleSelect, this.onSampleDeselect);

    this.spectraPlot = new Spectrum(this.spectraElement);
    this.spectraPlot.setOffset(this.state.yOffset);

    const { samples } = this.props;
    this.onNewSamples(samples);
  }

  onNewSamples(samples) {
    this.dp.setData(samples);
    // Force axes to span [0, 1] regardless of the samples
    const axes = this.dp.getAxes();
    for (let key of Object.keys(axes)) {
      axes[key] = {...axes[key], range: [0, 1]};
    }
    this.dp.setAxes(axes);
    const scalar = this.dp.getDefaultScalar(this.state.scalar);
    this.dp.setActiveScalar(scalar);
    const dataRange = this.dp.getScalarRange(scalar);
    const colorMapRange = [...dataRange];
    const selectedSamples = [];
    const sampleFields = [];

    this.quaternaryPlot.setColorMap(this.state.colorMap, dataRange);
    this.quaternaryPlot.dataUpdated();
    this.quaternaryPlot.render();
    this.spectraPlot.removeSpectra();
    this.setState({...this.state, scalar, colorMapRange, dataRange, selectedSamples, sampleFields});
  }

  onScalarChange(scalar) {
    this.dp.setActiveScalar(scalar);
    const dataRange = this.dp.getScalarRange(scalar);
    const colorMapRange = [...dataRange];
    this.quaternaryPlot.setColorMap(this.state.colorMap, dataRange);
    this.setState({...this.state, scalar, colorMapRange, dataRange});
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

  onSampleFieldChange(field, index) {
    let xField = this.state.xField;
    let yField = this.state.yField;
    if (index === 0) {
      xField = field;
    } else {
      yField = field;
    }
    this.spectraPlot.setAxes(xField, yField);
    this.setState({...this.state, xField, yField});
  }

  onOffsetChange(yOffset) {
    this.spectraPlot.setOffset(yOffset);
    this.setState({...this.state, yOffset});
  }

  onSampleSelect = (d) => {
    // fetchSample(d.id)
    //   .then(sample => {
    //     let spectrum = {};
    //     for (let key in sample) {
    //       spectrum[key] = sample[key].map((n) => parseFloat(n)).slice(100);
    //     }
    //     let metaData = {
    //       elements: this.state.dataSet.elements,
    //       components: d.components,
    //       id: d.id
    //     }
    //     let selectedSamples = [...this.state.selectedSamples];
    //     selectedSamples.push(d);
    //     if (this.state.selectedSamples.length === 0) {
    //       let sampleFields = [];
    //       for (let key in sample) {
    //         sampleFields.push(key);
    //       }
    //       let xField = sampleFields[0];
    //       let yField = sampleFields[1];
    //       this.spectraPlot.setAxes(xField, yField);
    //       this.setState({...this.state, selectedSamples, sampleFields, xField, yField});
    //     } else {
    //       this.setState({...this.state, selectedSamples});
    //     }
    //     this.spectraPlot.appendSpectrum(spectrum, metaData);
    //   });
  }

  onSampleDeselect = (d) => {
    // let selectedSamples = this.state.selectedSamples.filter(val=> val.id !== d.id);
    // this.setState({...this.state, selectedSamples});
    // this.spectraPlot.removeSpectrum(d);
  }

  render() {
    const scalars = this.dp ? this.dp.getScalars() : [];
    
    let scalarSelectOptions = [];
    for (let scalar of scalars) {
      scalarSelectOptions.push(<MenuItem key={scalar} value={scalar}>{scalar}</MenuItem>)
    }

    let colorMapSelectOptions = [];
    for (let name in this.colorMaps) {
      colorMapSelectOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    let sampleFieldsSelectOptions = [];
    for (let name of this.state.sampleFields) {
      sampleFieldsSelectOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
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
                    value={this.state.scalar || ""}
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

        <div style={{width: '100%', height: '30rem', position: 'relative', overflowX: 'scroll'}}>
          <div style={{width: '95rem', height: '100%'}}>
            <svg style={{width: '100%', height: '100%'}} ref={(ref)=>{this.compositionElement = ref;}}></svg>
          </div>
        </div>

        {this.state.selectedSamples.length >= 0 &&
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>X Axis</TableCell>
              <TableCell>Y Axis</TableCell>
              <TableCell>Offset</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor="select-scalar">Scalar</InputLabel> */}
                  <Select
                    value={this.state.xField || ""}
                    onChange={(e) => {this.onSampleFieldChange(e.target.value, 0)}}
                    inputProps={{name: 'scalar', id: 'select-scalar'}}
                  >
                    {sampleFieldsSelectOptions}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor="select-map">Color Map</InputLabel> */}
                  <Select
                    value={this.state.yField || ""}
                    onChange={(e) => {this.onSampleFieldChange(e.target.value, 1)}}
                    inputProps={{name: 'colorMap', id: 'select-map'}}
                  >
                    {sampleFieldsSelectOptions}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                  <div>
                    {this.state.yOffset.toFixed(3)}
                  </div>
                  <div style={{flexGrow: 1, paddingRight: 16}}>
                    <Slider 
                      min={0} max={10} step={0.1}
                      value={this.state.yOffset}
                      onChange={(e, val) => {this.onOffsetChange(val)}}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        }

        <div style={{width: '100%', height: '40rem', position: 'relative'}}>
          <svg style={{width: '100%', height: '100%'}} ref={(ref)=>{this.spectraElement = ref;}}></svg>
        </div>

        
      </div>
    );
  }
}

export default PlotComponentContainer;
