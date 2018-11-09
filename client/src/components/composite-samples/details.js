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

import SpectrumComponent from './spectrum';
import HeatMapComponent from './heatmap';

class SamplesDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'spectrum'
    }
  }

  onDisplayChange = (val) => {
    this.setState({display: val});
  }

  render() {
    const visSelector = (
      <Select value={this.state.display} onChange={(e) => {this.onDisplayChange(e.target.value)}}>
        <MenuItem value={'spectrum'}>Spectrum</MenuItem>
        <MenuItem value={'heatmap'}>Heatmap</MenuItem>
      </Select>
    );

    return (
      <div>
        {this.state.display === 'spectrum' &&
          <SpectrumComponent {...this.props} visSelector={visSelector} />
        }
        {this.state.display === 'heatmap' &&
          <HeatMapComponent {...this.props} visSelector={visSelector} />
        }
      </div>
    );
  }
}

export default SamplesDetails;