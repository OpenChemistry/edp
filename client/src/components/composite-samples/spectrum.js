import React, { Component } from 'react';
import { Spectrum } from 'composition-plot';

import {
  Select,
  MenuItem,
  FormControl,
  Slider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead
} from '@material-ui/core';

class SpectrumComponent extends Component {
  spectraElement;

  constructor(props) {
    super(props);
    this.state = {
      sampleFields: []
    };
  }

  componentDidMount() {
    const { yOffsetS } = this.props;
    this.spectraPlot = new Spectrum(this.spectraElement);
    this.spectraPlot.setOffset(yOffsetS);
    this.updateSpectra();
  }

  componentDidUpdate(prevProps) {
    let doUpdate = false;

    if (this.props.timeseries.length !== prevProps.timeseries.length) {
      doUpdate = true;
    }

    if (this.props.plots !== prevProps.plots) {
      doUpdate = true;
    }

    if (doUpdate) {
      this.updateSpectra();
    }
  }

  updateSpectra() {
    const { timeseries, onParamChanged } = this.props;
    let { xAxisS, yAxisS } = this.props;
    this.spectraPlot.setSpectra(this.props.timeseries);
    if (timeseries.length > 0) {
      const spectrum = timeseries[0].spectrum;
      const sampleFields = spectrum.getKeys();
      if (!(spectrum.hasKey(xAxisS))) {
        xAxisS = sampleFields[0];
      }
      if (!(spectrum.hasKey(yAxisS))) {
        yAxisS = sampleFields[1];
      }
      this.spectraPlot.setAxes(xAxisS, yAxisS);
      this.setState({sampleFields});
      onParamChanged({xAxisS, yAxisS});
    }
  }

  onSampleFieldChange(field, index) {
    let { xAxisS, yAxisS, onParamChanged } = this.props;
    if (index === 0) {
      xAxisS = field;
    } else {
      yAxisS = field;
    }
    this.spectraPlot.setAxes(xAxisS, yAxisS);
    onParamChanged({xAxisS, yAxisS});
  }

  onOffsetChange(yOffsetS) {
    const { onParamChanged } = this.props;
    this.spectraPlot.setOffset(yOffsetS);
    onParamChanged({yOffsetS});
  }

  render() {
    const { visSelector, detailSelector, xAxisS, yAxisS, yOffsetS } = this.props;
    let sampleFieldsSelectOptions = [];
    for (let name of this.state.sampleFields) {
      sampleFieldsSelectOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              {detailSelector &&
              <TableCell>Data</TableCell>
              }
              {visSelector &&
              <TableCell>Display</TableCell>
              }
              <TableCell>X Axis</TableCell>
              <TableCell>Y Axis</TableCell>
              <TableCell>Offset</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {detailSelector &&
              <TableCell>
                <FormControl fullWidth>
                  {detailSelector}
                </FormControl>
              </TableCell>
              }
              {visSelector &&
              <TableCell>
                <FormControl fullWidth>
                  {visSelector}
                </FormControl>
              </TableCell>
              }
              <TableCell>
                <FormControl fullWidth>
                  {/* <InputLabel htmlFor="select-scalar">Scalar</InputLabel> */}
                  <Select
                    value={xAxisS || ""}
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
                    value={yAxisS || ""}
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
                    {yOffsetS.toFixed(3)}
                  </div>
                  <div style={{flexGrow: 1, paddingRight: 16}}>
                    <Slider 
                      min={0} max={10} step={0.1}
                      value={yOffsetS}
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
