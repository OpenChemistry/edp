import React, { Component } from 'react';

import HomeIcon from '@material-ui/icons/Home';

const linkStyle = {
  // textDecoration: 'underline',
  color: "#5C6BC0",
  cursor: 'pointer'
}

const style = {
  fontSize: 18,
  padding: '1rem',
  paddingTop: '1.25rem',
  display: 'flex'
}

class BreadCrumb extends Component {
  render() {
    if (!this.props.experiment) {
      return null;
    }
    return (
        <div style={style}>
          <div style={linkStyle} onClick={this.props.onHomeClick}>
            <HomeIcon/>
          </div>
          <span>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <a  style={linkStyle}  onClick={this.props.onExperimentClick}>
              experiment {this.props.experiment.id}
            </a>
          </span>

          {this.props.test &&
          <span>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <a  style={linkStyle}  onClick={this.props.onTestClick}>
              test {this.props.test.id}
            </a>
          </span>
          }
      </div>
    );
  }
}

export default BreadCrumb;
