import React, { Component } from 'react';

class ExperimentView extends Component {
  render() {
    return (
      <div>
        <h3>Experiment {this.props.experiment.id} - {this.props.experiment.title}</h3>
        <button onClick={() => {this.props.onEditExperiment()}}>Edit</button>
        <button onClick={() => {this.props.onAddTest()}}>New test</button>
      </div>
    );
  }
}

export default ExperimentView;
