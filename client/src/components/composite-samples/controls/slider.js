import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead
} from '@material-ui/core';
import { Slider} from '@material-ui/lab';

class SliderControlComponent extends Component {

  render() {
    const {
      label,
      value,
      range,
      step,
      onChange
    } = this.props;

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{label}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                <div style={{flexGrow: 1, paddingRight: 16}}>
                  <Slider
                    min={range[0]} max={range[1]} step={step}
                    value={value}
                    onChange={(_e, val) => { onChange(val); }}
                  />
                </div>
                <div>
                  {value}
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default SliderControlComponent;
