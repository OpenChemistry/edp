import React, {Component} from 'react';
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

import { colors } from 'composition-plot';

import QuaternaryPlotComponent from './quaternary-plot';

class PlotComponentContainer extends Component {

  constructor(props) {
    super(props);

    this.colorMaps = {
      'Viridis': colors.viridis,
      'Plasma': colors.plasma,
      'Red White Blue': colors.redWhiteBlue,
      'Green Blue': [[0, 1, 0], [0, 0, 1]],
    }
  }

  onScalarChange(scalarField) {
    const { onParamChanged } = this.props;
    onParamChanged({
      scalarField
    });
  }

  onColorMapChange(activeMap) {
    const { onParamChanged } = this.props;
    onParamChanged({activeMap});
  }

  onColorMapRangeChange(value, index) {
    const { colorMapRange, onParamChanged } = this.props;
    const otherIndex = (index + 1) % 2;
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
  }

  render() {
    const {
      samples,
      scalarField,
      activeMap,
      colorMapRange,
      onClearSelection,
      selectedSamples,
      selectedSampleKeys,
      detailsPanel,
      mlModels,
      onSampleSelectById,
      onSampleDeselect,
      onSampleSelect,
      onParamChanged,
      mlModelIteration,
      nMlModelIteration,
      mlModelMetric,
      mlModelMetrics
    } = this.props;

    const scalars = this.quaternaryPlot ? this.quaternaryPlot.dp.getScalars() : [];
    const dataRange = this.quaternaryPlot ? this.quaternaryPlot.dp.getScalarRange(scalarField) : [0, 1];

    let scalarSelectOptions = [];
    for (let scalar of scalars) {
      scalarSelectOptions.push(<MenuItem key={scalar} value={scalar}>{scalar.replace('\\u002', '.')}</MenuItem>)
    }

    let colorMapSelectOptions = [];
    for (let name in this.colorMaps) {
      colorMapSelectOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    let detailsPanelOptions = [];
    for (let name of ['details'].concat(mlModels || [])) {
      detailsPanelOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    let metricOptions = [];
    for (let name of mlModelMetrics || []) {
      metricOptions.push(<MenuItem key={name} value={name}>{name}</MenuItem>)
    }

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Scalar field</TableCell>
              <TableCell>Color map</TableCell>
              <TableCell>Map range</TableCell>
              <TableCell>Display</TableCell>
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
                      min={dataRange[0]} max={dataRange[1]} step={0.001}
                      value={colorMapRange[0]}
                      onChange={(e, val) => {this.onColorMapRangeChange(val, 0)}}
                    />
                    <Slider
                      min={dataRange[0]} max={dataRange[1]} step={0.001}
                      value={colorMapRange[1]}
                      onChange={(e, val) => {this.onColorMapRangeChange(val, 1)}}
                    />
                  </div>
                  <div>
                    {colorMapRange[1].toFixed(3)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    value={detailsPanel || "details"}
                    onChange={(e) => {onParamChanged('detailsPanel', e.target.value)}}
                    inputProps={{name: 'detailsPanel', id: 'details-panel'}}
                  >
                    {detailsPanelOptions}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <QuaternaryPlotComponent
          ref={(ref) => {this.quaternaryPlot = ref;}}
          samples={samples}
          scalarField={scalarField}
          activeMap={activeMap}
          colorMapRange={colorMapRange}
          selectedSampleKeys={selectedSampleKeys}
          onParamChanged={onParamChanged}
          onSampleSelect={onSampleSelect}
          onSampleDeselect={onSampleDeselect}
        />

        {detailsPanel === 'details' &&
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
        }

        {detailsPanel !== 'details' &&
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Difference metric</TableCell>
              <TableCell>
              Model iteration
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Select
                  value={mlModelMetric}
                  onChange={(e) => {onParamChanged('mlModelMetric', e.target.value)}}
                  inputProps={{name: 'mlModelMetric', id: 'model-metrics'}}
                >
                  {metricOptions}
                </Select>
              </TableCell>
              <TableCell>
                <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                  <div style={{flexGrow: 1, paddingRight: 16}}>
                    <Slider
                      aria-labelledby="map-range-label"
                      min={0} max={nMlModelIteration} step={1}
                      value={mlModelIteration}
                      onChange={(e, val) => { onParamChanged('mlModelIteration', val); }}
                    />
                  </div>
                  <div>
                    {mlModelIteration}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        }

      </div>
    );
  }
}

export default PlotComponentContainer;
