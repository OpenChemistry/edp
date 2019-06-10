import React, { Component } from 'react';
import SelectControlComponent from './select';
import ControlsGrid from './grid';

class CompositionSpaceComponent extends Component {

  onChange = (value, i) => {
    const {onChange} = this.props;
    const compositionSpace = [...this.props.compositionSpace];
    compositionSpace[i] = value;
    onChange(compositionSpace);
  }

  render() {
    let {
      n,
      k,
      compositionSpace,
      elements
    } = this.props;

    if (elements.length !== n) {
      return null;
    }

    if (compositionSpace.length < k) {
      return null;
    } else if (compositionSpace.length > k) {
      compositionSpace = compositionSpace.slice(0, k);
    }

    const chosen = new Set(compositionSpace);
    const available = new Set();
    elements.forEach(el => {
      if (!chosen.has(el)) {
        available.add(el);
      }
    });

    let controlSize;
    switch(k) {
      case 2: {
        controlSize = 6;
        break;
      }
      case 3: {
        controlSize = 4;
        break;
      }
      case 4: {
        controlSize = 3;
        break;
      }
      case 5:
      case 6: {
        controlSize = 2;
        break;
      }
      case 7:
      case 8: {
        controlSize = 3;
        break;
      }
    }

    const selectors = [];
    for (let i = 0; i < k; ++i) {
      const options = [compositionSpace[i]];
      available.forEach(e => {options.push(e)});
      selectors.push(
        <SelectControlComponent
          key={i}
          gridsize={{xs: 6, sm: controlSize}}
          label={`Element ${i + 1}`}
          value={compositionSpace[i]}
          options={options}
          onChange={val => { this.onChange(val, i); }}
        />
      );
    }

    return (
      <ControlsGrid>
        {selectors}
      </ControlsGrid>
    );
  }
}

export default CompositionSpaceComponent;