import { replace } from 'connected-react-router';

export const identity = val => val;

export const arraySerialize = val => JSON.stringify(val);
export const arrayDeserialize = val => JSON.parse(val);

export const numberSerialize = val => val;
export const numberDeserialize = val => parseFloat(val);

export const boolSerialize = val => val ? 'true' : 'false';
export const boolDeserialize = val => val.toLowerCase() === 'true';

export const setSerialize = val => JSON.stringify(Array.from(val));
export const setDeserialize = val => {
  const arr = JSON.parse(val);
  return Array.isArray(arr) ? new Set(arr) : new Set();
};

export const defaultWrapper = (fn, def) => {
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



export function onStateParamChanged(...args) {
  let updates;
  if (args.length === 1) {
    updates = args[0];
  } else if (args.length === 2) {
    updates = {[args[0]]: args[1]};
  } else {
    return;
  }

  this.setState(state => {
    for (let key in updates) {
      if (key in state) {
        state[key] = updates[key];
      }
    }
    return state;
  });  
}

export function onParamChanged(...args) {
  // Either pass one single object with the key/value pairs to update
  // or pass two arguments, (key first, value second)
  const URL_PARAMS = this.getUrlParams();

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
      if (URL_PARAMS[key].callback) {
        URL_PARAMS[key].callback.call(this, props[key], updates[key]);
      }
      props[key] = updates[key];
    }
  }

  this.updateParams(props);
}

export function updateParams(props) {
  const { dispatch, location } = props;
  const URL_PARAMS = this.getUrlParams();
  const searchParams = new URLSearchParams(props.location.search);
  for (let key in URL_PARAMS) {
    const val = URL_PARAMS[key].serialize(props[key]);
    if (val !== null && val !== undefined) {
      searchParams.set(key, val);
    }
  }
  const url = `${location.pathname}?${searchParams.toString()}`;
  dispatch(replace(url));
}
