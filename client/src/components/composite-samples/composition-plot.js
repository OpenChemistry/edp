import React, { Fragment } from 'react';

import { withStyles } from '@material-ui/core';
import QuaternaryPlot from './quaternary-plot';
import MultidimensionalPlot from './multidimension-plot';
import ColorMapLegend from './colormap-legend';

const styles = _theme => ({
  root: {
    width: '100%',
    display: 'flex'
  },
  plot: {
    width: '100%'
  },
  legend: {
    height: '100%',
    width: '4rem',
    marginLeft: '-4rem'
  }
});

const CompositionPlot = (props) => {
  const {
    compositionPlot,
    compositionToPosition,
    showLegend,
    activeMap,
    colorMapRange,
    colorMaps,
    classes
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.plot} style={{paddingRight:  showLegend ? '4rem' : '0'}}>
        {compositionPlot === '2d' &&
        <QuaternaryPlot {...props}/>
        }
        {(compositionPlot === '3d' && compositionToPosition) &&
        <MultidimensionalPlot {...props}/>
        }
      </div>
      {showLegend &&
      <div className={classes.legend}>
        <ColorMapLegend
          activeMap={activeMap} colorMapRange={colorMapRange} colorMaps={colorMaps}
          direction='vertical'
        />
      </div>
      }
    </div>
  );
}

export default withStyles(styles)(CompositionPlot);
