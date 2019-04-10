import React, { Component } from 'react';
import { InfoProvider } from 'composition-plot';

class InfoExtractor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      info: null
    }
  }

  componentDidMount() {
    this.onNewSamples();
  }

  componentDidUpdate(prevProps) {
    const { samples } = this.props;

    if ( samples.length !== prevProps.samples.length ) {
      this.onNewSamples();
    }
  }

  onNewSamples() {
    const info = new InfoProvider();
    const { samples } = this.props;
    info.setData(samples);

    this.setState(state => {
      state.info = info;
      return state;
    });
  }

  renderChildren() {
    const { info } = this.state;
    return React.Children.toArray(this.props.children).map((child, i) => {
      return React.cloneElement(child, { info });
    });
  }

  render() {
    const { info } = this.state;
    if (info) {
      return this.renderChildren();
    }
    return null;
  }
}

export default InfoExtractor;
