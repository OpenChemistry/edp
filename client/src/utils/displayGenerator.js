import React from 'react';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import ReactMarkdown from 'react-markdown'

import { isNil } from 'lodash-es';

import FileDownloadCOmponent from '../components/fields/file-download';

export function renderDisplayFields(fields, exclude = null) {
  if (!exclude) {
    exclude = [];
  }
  let displayFields = [];
  for (let key in fields) {
    const field = fields[key];
    const type = field.type;
    const label = field.label;
    // const disabled = field.hasOwnProperty('disabled') ? field.disabled : false;
    const value = field.value;
    const hidden = field.hasOwnProperty('hidden') ? field.hidden : false;

    let doPush = (
      exclude.findIndex((val) => val === key) === -1 &&
      value
    );

    if (!doPush) {
      continue;
    }

    switch (type) {
      case 'checkbox': {
        displayFields.push(
          <div key={key} hidden={hidden}>
            <Typography gutterBottom variant="subheading" color="textSecondary">
              {label}
              <Checkbox
                disabled
                checked={value}
              />
            </Typography>
          </div>
        )
        break;
      }

      case 'date':
      case 'textarea':
      case 'text': {
        displayFields.push(
          <div key={key} hidden={hidden}>
            <Typography gutterBottom variant="subheading" color="textSecondary">
              {label}
            </Typography>
            <Typography component='div'>
              <ReactMarkdown >
                {value}
              </ReactMarkdown>
            </Typography>
          </div>
        );
        break;
      }

      case 'fileId': {
        const downloadUrl = `/api/v1/file/${value}/download`;
        if (!isNil(field['thumbnail'])) {
          const thumbUrl = `/api/v1/file/${field['thumbnail']}/download?contentDisposition=inline`;
          displayFields.push(
            <div key={key} hidden={hidden}>
              <Typography gutterBottom variant="subheading" color="textSecondary">
                {label}
              </Typography>
              <div style={{width: '100%', maxHeight: '20rem'}}>
                <a href={downloadUrl} download>
                  <img style={{width: '100%', maxHeight: '20rem', objectFit: 'contain'}} src={thumbUrl}/>
                </a>
              </div>
            </div>
          );
        } else {
          displayFields.push(
            <div key={key} hidden={hidden}>
              <Typography gutterBottom variant="subheading" color="textSecondary">
                {label}
              </Typography>
              <Typography paragraph>
                <FileDownloadCOmponent fileId={value}/>
              </Typography>
            </div>
          );
        }
        break;
      }

      default: {
        break;
      }
    }
  }
  return displayFields;
}
