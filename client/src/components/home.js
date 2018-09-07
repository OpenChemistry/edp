import React, { Component } from 'react';

import { Typography } from '@material-ui/core';

class HomePage extends Component {
  render() {
    return (
      <div style={{textAlign: 'center', marginTop: '4rem'}}>
        <Typography variant='display1' gutterBottom>Welcome</Typography>
        <Typography variant='subheading'>Please log in to get started</Typography>
      </div>
    );
  }
}

export default HomePage;
