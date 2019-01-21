import React, { Component } from 'react';

import {
  Select,
  MenuItem
} from '@material-ui/core';

import SpectrumComponent from './spectrum';
import HeatMapComponent from './heatmap';

class SamplesDetails extends Component {

  render() {
    const { display, fitted, onParamChanged } = this.props;
    const visSelector = (
      <Select value={display} onChange={(e) => { onParamChanged('display', e.target.value)}}>
        <MenuItem value={'spectrum'}>Spectrum</MenuItem>
        <MenuItem value={'heatmap'}>Heatmap</MenuItem>
      </Select>
    );

    const  detailSelector = (
      <Select value={fitted} onChange={(e) => { onParamChanged('fitted', e.target.value)}}>
        <MenuItem value={true}>Fitted Data</MenuItem>
        <MenuItem value={false}>Raw Data</MenuItem>
      </Select>
    );

    return (
      <div>
        {display === 'spectrum' &&
          <SpectrumComponent {...this.props} visSelector={visSelector} detailSelector={detailSelector} />
        }
        {display === 'heatmap' &&
          <HeatMapComponent {...this.props} visSelector={visSelector} detailSelector={detailSelector} />
        }
      </div>
    );
  }
}

export default SamplesDetails;
