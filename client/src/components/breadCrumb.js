import React, { Component } from 'react';

import HomeIcon from '@material-ui/icons/Home';
import { getNodes } from '../nodes';

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
    const {ancestors, onSegmentClick} = this.props;
    const NODES = getNodes();

    if (ancestors.length === 0) {
      return null;
    }

    const maxLen = 6;

    const segments = [];
    segments.push(
      <div key='home'>
        <span  style={linkStyle} onClick={() => {onSegmentClick(-1)}}>
          <HomeIcon/>
        </span>
      </div>
    );

    for (let i = 0; i < ancestors.length; ++i) {
      let ancestor = ancestors[i];
      let label = "";
      if (ancestor.type && NODES[ancestor.type]) {
        label = NODES[ancestor.type].label;
        if (ancestor.fields) {
          label += ' - ';
          label += NODES[ancestor.type].primaryPrefix ? `${NODES[ancestor.type].primaryPrefix} ` : '';
          label += ancestor.fields[NODES[ancestor.type].primaryField]
          label += NODES[ancestor.type].primaryPrefix ? ` ${NODES[ancestor.type].primarySuffix}` : '';
        }
      }
      segments.push(
        <div key={i}>
          &nbsp;&nbsp;/&nbsp;&nbsp;
          <span  style={linkStyle} onClick={() => {onSegmentClick(i)}}>
            {label}
          </span>
        </div>
      );
    }

    return (
        <div style={style}>
          {segments}
      </div>
    );
  }
}

export default BreadCrumb;
