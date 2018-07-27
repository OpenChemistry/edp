import React, { Component } from 'react';

class TestView extends Component {
  render() {

    return (
      <div>
        <h3>Test {this.props.test.id} - {this.props.test.text}</h3>
        <button onClick={() => {this.props.onBackToExperiment()}}>Back</button>
        <button onClick={() => {this.props.onEditTest()}}>Edit test</button>
      </div>
    );
  }
}

export default TestView;
