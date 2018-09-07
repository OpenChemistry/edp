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
    if (!this.props.experimentId) {
      return null;
    }
    const maxLen = 6;
    return (
        <div style={style}>
          <div>
            <span  style={linkStyle}  onClick={this.props.onHomeClick}>
              <HomeIcon/>
            </span>
          </div>

          {!this.props.experimentId &&
          <div>
            <span  style={linkStyle}  onClick={this.props.onHomeClick}>
            &nbsp;Experimental Data Platform
            </span>
          </div>
          }

          {this.props.experimentId &&
          <div>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <span  style={linkStyle}  onClick={this.props.onExperimentClick}>
              experiment {this.props.experimentId.slice(-maxLen)}
            </span>
          </div>
          }

          {this.props.batchId &&
          <div>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <span  style={linkStyle}  onClick={this.props.onBatchClick}>
              batch {this.props.batchId.slice(-maxLen)}
            </span>
          </div>
          }

          {this.props.testId &&
          <div>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <span  style={linkStyle}  onClick={this.props.onTestClick}>
              test {this.props.testId.slice(-maxLen)}
            </span>
          </div>
          }
      </div>
    );
  }
}

export default BreadCrumb;
