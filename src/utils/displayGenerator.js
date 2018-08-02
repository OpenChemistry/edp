import React from 'react';
import Typography from '@material-ui/core/Typography';

export function renderDisplayFields(fields) {
  let displayFields = [];
  for (let key in fields) {
    const field = fields[key];
    const type = field.type;
    const label = field.label;
    // const disabled = field.hasOwnProperty('disabled') ? field.disabled : false;
    const value = field.value;

    if (type === 'checkbox') {
      
    } else if (type === 'file') {
      displayFields.push(
        <div key={key}>
          <Typography gutterBottom variant="subheading" color="textSecondary">
            {label}
          </Typography>
          <Typography  paragraph color='primary' style={{cursor: 'pointer', textDecoration: 'underline'}}>
            {value}
          </Typography>
        </div>
      );
    } else {
      let doPush = ( key !== 'title' && key !== 'date' && key !== 'channel' && value);
      if (doPush) {
        displayFields.push(
          <div key={key}>
            <Typography gutterBottom variant="subheading" color="textSecondary">
              {label}
            </Typography>
            <Typography  paragraph>
              {value}
            </Typography>
          </div>
        );
      }
    }
  }
  return displayFields;
}