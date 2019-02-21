import React, { Component } from 'react';
import { isNil, has } from 'lodash-es';

import { Card, Typography } from '@material-ui/core';

import { Spectrum, } from 'composition-plot';
import { ArrayDataProvider } from 'composition-plot/dist/data-provider/spectrum';

class PlotComponent extends Component {
  spectraElement;
  spectraPlot;

  componentDidMount() {
    this.spectraPlot = new Spectrum(this.spectraElement);
    this.updateSpectra();
  }

  componentDidUpdate(prevProps) {
    // this.updateSpectra();
  }

  updateSpectra() {
    const { data } = this.props;
    let x = data.x.data;
    const xLabel = data.x.label || 'x';
    const y = data.y.data;
    const yLabel = data.y.label || 'y';
    if (isNil(x)) {
      x = [];
      for (let i = 0; i < y.length; ++i) {
        x.push(i);
      }
    }
    const spectrum = new ArrayDataProvider();
    spectrum.setArray('x', x);
    spectrum.setLabel('x', xLabel);
    spectrum.setArray('y', y);
    spectrum.setLabel('y', yLabel);
    this.spectraPlot.setSpectra([{spectrum, sample: null}]);
    this.spectraPlot.setAxes('x', 'y');

    if(has(data.x, 'range')) {
      this.spectraPlot.setXRange(data.x.range);
    }
    if(has(data.y, 'range')) {
      this.spectraPlot.setYRange(data.y.range);
    }
  }

  render() {
    const { title } = this.props;
    return (
      <Card style={{marginTop: '2rem', paddingTop: '1rem'}}>
        <Typography variant="title" align="center" gutterBottom>{title}</Typography>
        <div style={{width: '100%', height: '30rem', position: 'relative'}}>
          <svg style={{width: '100%', height: '100%'}} ref={(ref)=>{this.spectraElement = ref;}}></svg>
        </div>
      </Card>
    );
  }
};

export default PlotComponent;
