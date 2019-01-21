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
  Switch,
  TextField
} from '@material-ui/core';

class HeatMapComponent extends Component {
  heatMapElement;

  constructor(props) {
    super(props);
    this.state = {
      sampleFields: [],
      nY: 50,
      selection: ''
    };
  }

  componentDidMount() {
    this.dp = new HeatMapDataProvider();
    this.heatMap = new HeatMap(this.heatMapElement, this.dp);
    this.onNewData();
  }

  componentDidUpdate(prevProps) {
    let doUpdate = false;

    if (this.props.timeseries.length !== prevProps.timeseries.length) {
      doUpdate = true;
    }

    if (this.props.fitted !== prevProps.fitted) {
      doUpdate = true;
    }

    if (doUpdate) {
      this.onNewData();
    }
  }

  onNewData() {
    const { timeseries, onParamChanged } = this.props;
    // this.spectraPlot.setSpectra(timeseries);
    if (timeseries.length > 0) {
      const spectrum = timeseries[0].spectrum;
      const sampleFields = spectrum.getKeys();
      let { yAxisH, zAxisH } = this.props;
      if (!(spectrum.hasKey(yAxisH))) {
        yAxisH = sampleFields[0];
      }
      if (!(spectrum.hasKey(zAxisH))) {
        zAxisH = sampleFields[1];
      }
      // spectrum[xField] = [0, 0.2, 0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4, 0.2, 0];
      // spectrum[yField] = [0, 0.04, 0.16, 0.36, 0.64, 1, 1 - 0.04, 1 - 0.16, 1 - 0.36, 1 - 0.64, 0];

      this.setState({sampleFields});
      onParamChanged({yAxisH, zAxisH});
      this.dp.setData(timeseries);
      setTimeout(() => {
        this.refreshHeatMap();
      });
    }
  }

  refreshHeatMap() {
    const { yAxisH, zAxisH,reduceFnH, separateSlopeH, selectionH } = this.props;
    const { nY } = this.state;
    this.dp.setNumY(nY);
    this.dp.setActiveScalars([yAxisH, zAxisH]);
    this.dp.setSeparateSlope(separateSlopeH);
    this.dp.selectSegments(selectionH);
    this.dp.setReduceFn(reduceFnH);
    this.dp.computeMaps();
    this.heatMap.dataUpdated();
  }

  onSampleFieldChange(field, index) {
    let {yAxisH, zAxisH, onParamChanged} = this.props;
    if (index === 0) {
      yAxisH = field;
    } else {
      zAxisH = field;
    }
    onParamChanged({yAxisH, zAxisH});
    setTimeout(() => {
      this.refreshHeatMap();
    });
  }

  onSeparateSlopeChange(separateSlopeH) {
    const { onParamChanged } = this.props;
    onParamChanged({separateSlopeH});
    setTimeout(() => {
      this.refreshHeatMap();
    });
  }

  onReduceFnChange(reduceFnH) {
    const { onParamChanged } = this.props;
    onParamChanged({reduceFnH});
    setTimeout(() => {
      this.refreshHeatMap();
    });
  }

  onSelectionChange(selectionH) {
    const { onParamChanged } = this.props;
    onParamChanged({selectionH});
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
    const { visSelector, detailSelector, yAxisH, zAxisH, reduceFnH, separateSlopeH, selectionH } = this.props;
    let sampleFieldsSelectOptions = [];
    for (let name of this.state.sampleFields) {
      sampleFieldsSelectOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    const reduceFnOptions = [];
    for (let name of ['median', 'mean', 'min', 'max']) {
      reduceFnOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    const nSegments = this.dp ? this.dp.getSegments().length : 0;

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
              <TableCell>Y Axis</TableCell>
              <TableCell>Z Axis</TableCell>
              <TableCell>Reduce Function</TableCell>
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
                    value={yAxisH || ""}
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
                    value={zAxisH || ""}
                    onChange={(e) => {this.onSampleFieldChange(e.target.value, 1)}}
                    inputProps={{name: 'colorMap', id: 'select-map'}}
                  >
                    {sampleFieldsSelectOptions}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    value={reduceFnH}
                    onChange={(e) => {this.onReduceFnChange(e.target.value, 1)}}
                    inputProps={{name: 'reduceFn', id: 'select-reduce'}}
                  >
                    {reduceFnOptions}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell>Separate Slope</TableCell>
              { separateSlopeH &&
              <TableCell>Segments ({nSegments})</TableCell>
              }
              {/*<TableCell>NY</TableCell>*/}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Switch checked={separateSlopeH} onChange={(e) => {this.onSeparateSlopeChange(e.target.checked)}}/>
              </TableCell>
              {separateSlopeH &&
              <TableCell>
                <FormControl fullWidth>
                  <TextField
                    value={selectionH}
                    onChange={(e) => {this.onSelectionChange(e.target.value)}}
                  ></TextField>
                </FormControl>
              </TableCell>
              }
              {/* <TableCell>
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
              </TableCell> */}
            </TableRow>
          </TableBody>
        </Table>

        <div style={{width: '100%', height: '40rem'}} ref={(ref)=>{this.heatMapElement = ref;}}>
        </div>
      </div>
    );
  }
}

export default HeatMapComponent;
