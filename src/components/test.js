import React, { Component } from 'react';


class TestList extends Component {
  render() {

    return (
      <div>
        <button onClick={() => {this.props.onAddExperiment()}}>New experiment</button>
        <ul>
          {Object.values(this.props.experiments).map((experiment) => {
            return (
              <div key={experiment.id}>
                <li>{experiment.id} - {experiment.title}</li>
                <button onClick={() => {this.props.onDeleteExperiment(experiment.id)}}>Delete experiment</button>
                <button onClick={() => {this.props.onAddTest(experiment.id)}}>New test</button>
                <ul>
                  {experiment.tests.map((testId) => {
                    let test = this.props.tests[testId];
                    return (
                      <div key={test.id}>
                        <li>{test.id} - {test.title}</li>
                        <button onClick={() => {this.props.onDeleteTest(test.id)}}>Delete test</button>
                      </div>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default TestList;
