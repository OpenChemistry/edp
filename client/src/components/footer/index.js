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
    marginLeft: '1rem'
  }
}

export default (props) => {
  const {privacy, license} = props;
  return (
    <div style={style.root}>
      <Typography variant='caption'>
        {license &&
        <span>
          All data is released under this <a href={license} target='_blank'>license</a>
        </span>
        }
        {privacy &&
        <a style={style.privacy} href={privacy} target='_blank'>Privacy Policy</a>
        }
      </Typography>
    </div>
  );
}
