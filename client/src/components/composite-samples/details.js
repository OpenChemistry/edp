import React, { Component } from 'react';

import {
  Select,
  MenuItem
} from '@material-ui/core';

import SpectrumComponent from './spectrum';
import HeatMapComponent from './heatmap';

class SamplesDetails extends Component {

  render() {
    const { display, onParamChanged } = this.props;
    const visSelector = (
      <Select value={display} onChange={(e) => { onParamChanged('display', e.target.value)}}>
        <MenuItem value={'spectrum'}>Spectrum</MenuItem>
        <MenuItem value={'heatmap'}>Heatmap</MenuItem>
      </Select>
    );

    return (
      <div>
        {display === 'spectrum' &&
          <SpectrumComponent {...this.props} visSelector={visSelector} />
        }
        {display === 'heatmap' &&
          <HeatMapComponent {...this.props} visSelector={visSelector} />
        }
      </div>
    );
  }
}

export default SamplesDetails;
