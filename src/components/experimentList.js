import React, { Component } from 'react';

class ExperimentList extends Component {
  render() {

    return (
      <div>
        <button onClick={() => {this.props.onAddExperiment()}}>New experiment</button>
        <ul>
          {Object.values(this.props.experiments).map((experiment) => {
            return (
              <div key={experiment.id}>
                <li>{experiment.id} - {experiment.title}</li>
                <button onClick={() => {this.props.onOpenExperiment(experiment.id)}}>Open experiment</button>
                <button onClick={() => {this.props.onDeleteExperiment(experiment.id)}}>Delete experiment</button>
              </div>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default ExperimentList;
