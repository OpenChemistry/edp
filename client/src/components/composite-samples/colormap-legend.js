import React from 'react';
import { ColorMapLegend } from 'composition-plot';

class ColorMapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
  }

  componentDidMount() {
    this.colorMapLegend = new ColorMapLegend(this.containerRef.current);
    this.updateLegend();
  }

  componentDidUpdate(prevProps) {
    const { activeMap, colorMapRange, direction } = this.props;
    if (
      direction !== prevProps.direction ||
      activeMap !== prevProps.activeMap ||
      colorMapRange[0] !== prevProps.colorMapRange[0] ||
      colorMapRange[1] !== prevProps.colorMapRange[1]
    ) {
      this.updateLegend();
    }
  }

  updateLegend() {
    const { activeMap, colorMapRange, colorMaps, direction } = this.props;
    const colorMap = colorMaps[activeMap];
    this.colorMapLegend.setDirection(direction);
    this.colorMapLegend.setColors(colorMap);
    this.colorMapLegend.setRange(colorMapRange);
    this.colorMapLegend.draw();
  }

  render() {
    const { direction } = this.props;
    const style = direction === 'horizontal'
    ? {
      height: '2.5rem', width: '100%'
    }
    : {
      height: '22.5rem', width: '100%'
    };

    return (
      <div style={style} ref={this.containerRef}/>
    )
  }
}

export default ColorMapComponent;
