import React, {Component} from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead
} from '@material-ui/core';

import { isString } from 'lodash-es';

class SelectControlComponent extends Component {

  render() {
    const {
      label,
      value,
      options,
      onChange
    } = this.props;

    let selectOptions = [];
    for (let option of options) {
      if (isString(option)) {
        selectOptions.push(
          <MenuItem key={option} value={option}>{option.replace('\\u002', '.')}</MenuItem>
        );
      } else {
        const {label, value} = option;
        selectOptions.push(
          <MenuItem key={value} value={value}>{label.replace('\\u002', '.')}</MenuItem>
        );
      }
    }

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
              <FormControl fullWidth>
                <Select
                  value={value || ""}
                  onChange={(e) => {onChange(e.target.value)}}
                  inputProps={{name: 'select', id: 'select'}}
                >
                  {selectOptions}
                </Select>
              </FormControl>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default SelectControlComponent;
