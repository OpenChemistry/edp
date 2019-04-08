import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Selected samples</TableCell>
            <TableCell>Add to selection</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <div style={{minWidth: '40rem', display: 'flex'}}>
                <TextField fullWidth
                  disabled
                  value={selectedSamples.map(sample => sample.sampleNum).join(', ')}
                ></TextField>
                <Button onClick={onClearSelection}>Clear</Button>
              </div>
            </TableCell>
            <TableCell>
              <TextField
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    onSampleSelectById(e.target.value);
                    e.target.value = '';
                  }
                }}
              ></TextField>
              {/* <Button>Add</Button> */}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default SampleSelectionComponent;
