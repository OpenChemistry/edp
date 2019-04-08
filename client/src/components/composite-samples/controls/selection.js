import React, {Component} from 'react';
import {
  TextField,
  Button
} from '@material-ui/core';

class SampleSelectionComponent extends Component {

  render() {
    const {
      onClearSelection,
      selectedSamples,
      onSampleSelectById
    } = this.props;

    return (
        <div style={{display: 'flex'}}>
          <TextField fullWidth
            disabled
            label='Selected samples'
            InputLabelProps={{shrink: true}}
            value={selectedSamples.map(sample => sample.sampleNum).join(', ')}
          ></TextField>
          <Button onClick={onClearSelection}>Clear</Button>
          <TextField
            label='Add to selection'
            InputLabelProps={{shrink: true}}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                onSampleSelectById(e.target.value);
                e.target.value = '';
              }
            }}
          ></TextField>
        </div>
    );
  }
}

export default SampleSelectionComponent;
