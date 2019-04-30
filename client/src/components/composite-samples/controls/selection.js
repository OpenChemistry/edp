import React, {Component} from 'react';
import {
  TextField,
  Button
} from '@material-ui/core';

import ControlsGrid from './grid';

class SampleSelectionComponent extends Component {

  render() {
    const {
      onClearSelection,
      selectedSamples,
      onSampleSelectById
    } = this.props;

    return (
      <ControlsGrid>

        <div gridsize={{xs: 9}} style={{display: 'flex'}}>
          <TextField fullWidth
            disabled
            label='Selected samples'
            InputLabelProps={{shrink: true}}
            value={selectedSamples.map(sample => sample.sampleNum).join(', ')}
          ></TextField>
          <Button onClick={onClearSelection}>Clear</Button>
        </div>

        <TextField
          gridsize={{xs: 3}}
          label='Add to selection'
          InputLabelProps={{shrink: true}}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              onSampleSelectById(e.target.value);
              e.target.value = '';
            }
          }}
        ></TextField>

      </ControlsGrid>
    );
  }
}

export default SampleSelectionComponent;
