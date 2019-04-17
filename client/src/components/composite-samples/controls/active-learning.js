import React,  { Component } from 'react';
import { isNil } from 'lodash-es';
import ControlsGrid from './grid';
import SelectControl from './select';
import SliderControl from './slider';
import NumberControl from './number';

class ActiveLearningParametersComponent extends Component {
  render() {
    const {
      model,
      values,
      onChange
    } = this.props;

    if (isNil(model)) {
      return null;
    }

    const {
      parameters
    } = model;

    const controls = Object.keys(parameters).map(key => {
      let {type, default: defaultValue, options, label, min, max, step} = parameters[key];
      const value = values[key] || defaultValue;

      if (!isNil(options)) {
        return (
          <SelectControl key={key}
            gridsize={{xs: 6, sm: 3, lg: 2}}
            label={label}
            value={value}
            options={options}
            onChange={(val) => {onChange(key, val)}}
          />
        )
      } else if (type === 'number') {
        return (
          <NumberControl key={key}
            gridsize={{xs: 6, sm: 3, lg: 2}}
            label={label}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(val) => {onChange(key, val)}}
          />
        )
      }
    });

    return (
      <ControlsGrid>
        {controls}
      </ControlsGrid>
    );
  }
}

export default ActiveLearningParametersComponent;
