import React, {Component} from 'react';
import {
  FormControl,
  Typography,
  Slider
} from '@material-ui/core';

class DoubleSliderControlComponent extends Component {

  onValueChange(newValue, index) {
    const { value, onChange } = this.props;
    const otherIndex = (index + 1) % 2;
    if (index === 0) {
      if (newValue >= value[otherIndex]) {
        return;
      }
    } else {
      if (newValue <= value[otherIndex]) {
        return;
      }
    }
    const range = [...value];
    range[index] = newValue;
    onChange(range);
  }

  render() {
    const {
      label,
      value,
      step,
      range,
      digits,
      onChange
    } = this.props;

    return (
      <FormControl fullWidth>
        <Typography variant='caption' color='textSecondary'>
          {label}
        </Typography>
        <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
          <div>
            {value[0].toFixed(!!digits ? digits : 2)}
          </div>
          <div style={{flexGrow: 1, paddingRight: 8, paddingLeft: 8}}>
            <Slider
              min={range[0]} max={range[1]} step={step}
              value={value}
              onChange={(_e, val) => { onChange(val); }}
            />
          </div>
          <div>
            {value[1].toFixed(!!digits ? digits : 2)}
          </div>
        </div>
      </FormControl>
    );
  }
}

export default DoubleSliderControlComponent;
