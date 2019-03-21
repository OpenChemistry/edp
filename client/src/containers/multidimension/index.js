import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'connected-react-router';
import { NearestCompositionToPositionProvider } from 'composition-plot';

import MultidimensionComponent from '../../components/multidimension';

const identity = val => val;

const arraySerialize = val => JSON.stringify(val);
const arrayDeserialize = val => JSON.parse(val);

const defaultWrapper = (fn, def) => {
  return (val) => {
    if (val !== null && val !== undefined) {
      try {
        return fn(val);
      } catch {
        return def;
      }
    } else {
      return def;
    }
  }
}

const URL_PARAMS = {
  scalarField: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, null)
  },
  activeMap: {
    serialize: defaultWrapper(identity, null),
    deserialize: defaultWrapper(identity, 'Viridis')
  },
  colorMapRange: {
    serialize: defaultWrapper(arraySerialize, null),
    deserialize: defaultWrapper(arrayDeserialize, [0, 1])
  },
  filterRange: {
    serialize: defaultWrapper(arraySerialize, null),
    deserialize: defaultWrapper(arrayDeserialize, [0, 1])
  }
}


class MultidimensionContainer extends Component {

  compositionToPosition;

  constructor(props) {
    super(props);
    this.compositionToPosition = new NearestCompositionToPositionProvider();
    this.state = {
      samples: []
    }
  }

  componentDidMount() {
    fetch('8dcomp2xyz.json')
    .then(res => res.json())
    .then(data => {this.updateCompositionToPosition(data);})
    .catch(e=> console.log('ERRRR', e));
  }

  updateCompositionToPosition(data) {
    let samples = [];

    if (Array.isArray(data)) {
      const chunk = 8 + 3;
      const nSamples = data.length / chunk;
      const every = 1;
      for (let _i = 0; _i < nSamples / every; ++_i) {
        let i = _i * every;
        let composition = data.slice(i * chunk, i * chunk + 8);
        samples.push({
          composition: {
            A: composition[0] * 0.01,
            B: composition[1] * 0.01,
            C: composition[2] * 0.01,
            D: composition[3] * 0.01,
            E: composition[4] * 0.01,
            F: composition[5] * 0.01,
            G: composition[6] * 0.01,
            H: composition[7] * 0.01
          },
          scalars: {
            A: composition[0] * 0.01,
            B: composition[1] * 0.01,
            C: composition[2] * 0.01,
            D: composition[3] * 0.01,
            E: composition[4] * 0.01,
            F: composition[5] * 0.01,
            G: composition[6] * 0.01,
            H: composition[7] * 0.01
          }
        });
      }
      this.compositionToPosition.setData(8, 10, data, false);
    }

    this.setState(state => {
      state.samples = samples;
      return state;
    });
  }

  onParamChanged = (...args) => {
    // Either pass one single object with the key/value pairs to update
    // or pass two arguments, (key first, value second)

    let updates;
    if (args.length === 1) {
      updates = args[0];
    } else if (args.length === 2) {
      updates = {[args[0]]: args[1]};
    } else {
      return;
    }

    const props = {...this.props};

    for (let key in updates) {
      if (key in URL_PARAMS) {
        props[key] = updates[key];
      }
    }

    this.updateParams(props);
  }

  updateParams = (props) => {
    const { dispatch, location } = props;
    const searchParams = new URLSearchParams();
    for (let key in URL_PARAMS) {
      const val = URL_PARAMS[key].serialize(props[key]);
      if (val !== null && val !== undefined) {
        searchParams.set(key, val);
      }
    }
    const url = `${location.pathname}?${searchParams.toString()}`;
    dispatch(replace(url));
  }

  render() {
    const { samples } = this.state;

    if (samples.length == 0) {
      return null;
    }

    const {
      activeMap,
      scalarField,
      colorMapRange,
      filterRange
    } = this.props;

    return (
      <MultidimensionComponent
        activeMap={activeMap}
        scalarField={scalarField}
        colorMapRange={colorMapRange}
        filterRange={filterRange}
        samples={samples}
        compositionToPosition={this.compositionToPosition}
        onParamChanged={this.onParamChanged}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const searchParams = new URLSearchParams(ownProps.location.search);
  let props = {};
  for (let key in URL_PARAMS) {
    props[key] = URL_PARAMS[key].deserialize(searchParams.get(key));
  }

  return props;
}

export default connect(mapStateToProps)(MultidimensionContainer);
