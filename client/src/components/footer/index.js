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
          All data is released under <a href={license.url} target='_blank'>{license.label}</a>
        </span>
        }
        {privacy &&
        <a style={style.privacy} href={privacy.url} target='_blank'>{privacy.label}</a>
        }
      </Typography>
    </div>
  );
}
