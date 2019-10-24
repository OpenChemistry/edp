import React, {Component} from 'react';
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography
} from '@material-ui/core';

class CheckboxControlComponent extends Component {

  render() {
    const {
      label,
      value,
      onChange,
      className
    } = this.props;

    return (
      <FormControl className={className}>
        <Typography variant='caption' color='textSecondary'>
          {label}
        </Typography>
        <Checkbox
          checked={value}
          onChange={(_e, val) => {onChange(val);}}
        />
      </FormControl>
    );
  }
}

export default CheckboxControlComponent;
