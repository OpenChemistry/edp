import React, { Component } from 'react';
import { isNil } from 'lodash-es';

import PlotComponent from './plot';

class VisualizationComponent extends Component {

  render() {
    const { data } = this.props;

    if (isNil(data)) {
      return null;
    }

    const plots = [];
    for (let title of Object.keys(data)) {
      plots.push(
        <PlotComponent key={title} title={title} data={data[title]}/>
      );
    }

    return (
      <div>
        {plots}
      </div>
    );
  }
};

export default VisualizationComponent;