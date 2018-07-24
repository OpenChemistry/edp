import React, { Component } from 'react';
import logo from './assets/logo.svg';
import './App.css';

import { AppBar, Toolbar, Button } from '@material-ui/core';

import CssBaseline from '@material-ui/core/CssBaseline';
import ExperimentForm from './components/experiment-form';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CssBaseline />
        <AppBar color="default" position="fixed">
          <Toolbar>
            <Button color="inherit" aria-label="Logo" style={{marginRight: 9}}>
              <img className='logo' src={logo} alt="logo" />
            </Button>
          </Toolbar>
        </AppBar>
        <div className="content">
          <ExperimentForm/>
          <br/>
        </div>
      </div>
    );
  }
}

export default App;
