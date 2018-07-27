import React, { Component } from 'react';

class TestList extends Component {
  
  render() {
    let tests = [];
    for (let key in this.props.tests) {
      let test = this.props.tests[key];
      tests.push(
        <div key={test.id}>
          <li>{test.id} - {test.text}</li>
          <button onClick={() => {this.props.onOpenTest(test.id)}}>Open test</button>
          <button onClick={() => {this.props.onDeleteTest(test.id)}}>Delete test</button>
        </div>
      );
    }

    return (
      <ul>
        {tests}
      </ul>
    );
  }
}

export default TestList;
