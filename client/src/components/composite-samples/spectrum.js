import React, { Component } from 'react';
import { Spectrum } from 'composition-plot';

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

class SpectrumComponent extends Component {
  spectraElement;

  constructor(props) {
    super(props);
    this.state = {
      sampleFields: [],
      xField: null,
      yField: null,
      yOffset: 0
    };
  }

  componentDidMount() {
    this.spectraPlot = new Spectrum(this.spectraElement);
    this.spectraPlot.setOffset(this.state.yOffset);
    this.updateSpectra();
  }

  componentDidUpdate(prevProps) {
    if (this.props.timeseries.length !== prevProps.timeseries.length) {
      this.updateSpectra();
    }
  }

  updateSpectra() {
    const { timeseries } = this.props;
    this.spectraPlot.setSpectra(this.props.timeseries);
    if (timeseries.length > 0) {
      const spectrum = timeseries[0].spectrum;
      const sampleFields = Object.keys(spectrum);
      let {xField, yField} = this.state;
      if (!(xField in spectrum)) {
        xField = sampleFields[0];
      }
      if (!(yField in spectrum)) {
        yField = sampleFields[1];
      }
      this.setState({xField, yField, sampleFields});
    }
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
    this.setState({xField, yField});
  }

  onOffsetChange(yOffset) {
    this.spectraPlot.setOffset(yOffset);
    this.setState({yOffset});
  }

  render() {
    let sampleFieldsSelectOptions = [];
    for (let name of this.state.sampleFields) {
      sampleFieldsSelectOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    return (
      <div>
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

        <div style={{width: '100%', height: '40rem', position: 'relative'}}>
          <svg style={{width: '100%', height: '100%'}} ref={(ref)=>{this.spectraElement = ref;}}></svg>
        </div>
      </div>
    );
  }
}

export default SpectrumComponent;
