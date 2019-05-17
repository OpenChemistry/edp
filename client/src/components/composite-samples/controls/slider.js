import React, {Component} from 'react';
import {
  FormControl,
  Typography
} from '@material-ui/core';
import { Slider} from '@material-ui/lab';

class SliderControlComponent extends Component {

  render() {
    const {
      label,
      value,
      range,
      step,
      onChange,
      digits
    } = this.props;

    return (
      <FormControl fullWidth>
        <Typography variant='caption'>
          {label}
        </Typography>
        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
          <div style={{flexGrow: 1, paddingRight: 16}}>
            <Slider
              min={range[0]} max={range[1]} step={step}
              value={value}
              onChange={(_e, val) => { onChange(val); }}
            />
          </div>
          <div>
            {value.toFixed(!!digits ? digits : 2)}
          </div>
        </div>
      </FormControl>
    );
  }
}

export default SliderControlComponent;
