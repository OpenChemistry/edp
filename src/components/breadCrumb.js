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
  display: 'flex',
  alignItems: 'center'
}

class BreadCrumb extends Component {
  render() {
    if (!this.props.experiment) {
      return null;
    }
    return (
        <div style={style}>
          <div>
            <HomeIcon style={linkStyle} onClick={this.props.onHomeClick}/>
          </div>
          <div>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <span  style={linkStyle}  onClick={this.props.onExperimentClick}>
              experiment {this.props.experiment.id}
            </span>
          </div>

          {this.props.test &&
          <div>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <span  style={linkStyle}  onClick={this.props.onTestClick}>
              test {this.props.test.id}
            </span>
          </div>
          }
      </div>
    );
  }
}

export default BreadCrumb;
