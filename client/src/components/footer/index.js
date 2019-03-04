import React from 'react';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import { Typography } from '@material-ui/core';

const style = {
  root: {
    textAlign: 'center',
    padding: '1rem'
  },
  privacy: {
    paddingLeft: '1rem'
  }
}

export default () => {

  return (
    <div style={style.root}>
      <Typography variant='caption'>
        All data is released under <a href='https://creativecommons.org/licenses/by/4.0/' target='_blank'>CC BY 4</a>
        <a style={style.privacy} href='https://www.tri.global/privacy-policy/' target='_blank'>Privacy Policy</a>
      </Typography>
    </div>
  );
}
