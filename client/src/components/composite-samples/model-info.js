import React, { Fragment } from 'react';

import { Typography } from '@material-ui/core';

import ControlsGrid from './controls/grid';

export default ({model, parameters}) => {
  return (
    <Fragment>
      <Typography gutterBottom variant='h5'>{model.name}</Typography>
      <ControlsGrid>
        {Object.keys(model.parameters || {}).map(key => {
          return (
            <div key={key} gridsize={{xs: 6, sm: 3, lg: 2}}>
              <Typography variant='caption'>{model.parameters[key].label}</Typography>
              <Typography>{parameters[key] || model.parameters[key].default}</Typography>
            </div>
          )
        })}
      </ControlsGrid>
    </Fragment>
  );
};
