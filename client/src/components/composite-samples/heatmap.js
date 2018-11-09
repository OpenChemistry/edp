import React, { Component } from 'react';
import { HeatMap, HeatMapDataProvider } from 'composition-plot';

import {
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Switch
} from '@material-ui/core';
import { Slider} from '@material-ui/lab';

class HeatMapComponent extends Component {
  heatMapElement;

  constructor(props) {
    super(props);
    this.state = {
      sampleFields: [],
      xField: null,
      yField: null,
      yOffset: 0,
      separateSlope: true,
      nY: 50
    };
  }

  componentDidMount() {
    this.dp = new HeatMapDataProvider();
    this.heatMap = new HeatMap(this.heatMapElement, this.dp);
    this.onNewData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.timeseries.length !== prevProps.timeseries.length) {
      this.onNewData();
    }
  }

  onNewData() {
    const { timeseries } = this.props;
    // this.spectraPlot.setSpectra(timeseries);
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
      // spectrum[xField] = [0, 0.2, 0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4, 0.2, 0];
      // spectrum[yField] = [0, 0.04, 0.16, 0.36, 0.64, 1, 1 - 0.04, 1 - 0.16, 1 - 0.36, 1 - 0.64, 0];

      this.setState({xField, yField, sampleFields});
      this.dp.setData(timeseries);
      setTimeout(() => {
        this.refreshHeatMap();
      });
    }
  }

  refreshHeatMap() {
    const { nY, separateSlope, xField, yField } = this.state;
    this.dp.setNumY(nY);
    this.dp.setActiveScalars([xField, yField]);
    this.dp.setSeparateSlope(separateSlope);
    this.dp.computeMaps();
    this.heatMap.dataUpdated();
  }

  onSampleFieldChange(field, index) {
    let xField = this.state.xField;
    let yField = this.state.yField;
    if (index === 0) {
      xField = field;
    } else {
      yField = field;
    }
    // this.dp.setActiveScalars([xField, yField]);
    // this.dp.computeMaps();
    // this.heatMap.dataUpdated();
    this.setState({xField, yField});
    setTimeout(() => {
      this.refreshHeatMap();
    });
  }

  onSeparateSlopeChange(flag) {
    this.setState({separateSlope: flag});
    setTimeout(() => {
      this.refreshHeatMap();
    });
  }

  onNyChange(nY) {
    this.setState({nY});
    setTimeout(() => {
      this.refreshHeatMap();
    });
  }

  render() {
    const {visSelector} = this.props;
    const {separateSlope, nY} = this.state;
    let sampleFieldsSelectOptions = [];
    for (let name of this.state.sampleFields) {
      sampleFieldsSelectOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              {visSelector &&
              <TableCell>Display</TableCell>
              }
              <TableCell>Y Axis</TableCell>
              <TableCell>Z Axis</TableCell>
              <TableCell>Separate by slope</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
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
                <FormControl fullWidth>
                  <Switch checked={separateSlope} onChange={(e) => {this.onSeparateSlopeChange(e.target.checked)}}/>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableBody>
          {/* <TableHead>
            <TableRow>
              <TableCell>Separate by slope</TableCell>
              <TableCell>Y bins</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Switch checked={separateSlope} onChange={(e) => {this.onSeparateSlopeChange(e.target.checked)}}/>
              </TableCell>
              <TableCell>
                <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                  <div>
                    {nY}
                  </div>
                  <div style={{flexGrow: 1, paddingRight: 16}}>
                    <Slider 
                      min={2} max={100} step={1}
                      value={nY}
                      onChange={(e, val) => {this.onNyChange(val)}}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody> */}
        </Table>

        <div style={{width: '100%', height: '40rem'}} ref={(ref)=>{this.heatMapElement = ref;}}>
        </div>
      </div>
    );
  }
}

export default HeatMapComponent;
