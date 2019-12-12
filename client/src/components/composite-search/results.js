import React, { Component } from 'react';

import { isNil } from 'lodash-es';

import {
  List,
  ListItem,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@material-ui/core';

import BarChartIcon from '@material-ui/icons/BarChart';
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';

function parseElements(elementsArray) {
  elementsArray = elementsArray.map(el => el.charAt(0).toUpperCase() + el.slice(1));
  return elementsArray.join(', ');
}

const ResultItem = (props) => {
  const {result, i, onOpen, availableUrls} = props;
  const nUrls = (availableUrls || []).length;

  const style = {};
  let onRowClick = () => {};
  if (nUrls === 1) {
    onRowClick = () => {
      onOpen(result, availableUrls[0]);
    }
    style['cursor'] = 'pointer';
  }

  return (
    <TableRow key={i} hover onClick={onRowClick} style={style}>
      <TableCell>{parseElements(result.platemap.elements)}</TableCell>
      <TableCell>{result.run.electrolyte}</TableCell>
      <TableCell>{result.run.solutionPh}</TableCell>
      <TableCell>{result.platemap.plateId}</TableCell>
      <TableCell>{result.run.runId}</TableCell>
      {nUrls === 2 &&
      <TableCell>
        <IconButton
          color='primary'
          onClick={() => {onOpen(result, availableUrls[0])}}
        >
          <ViewCarouselIcon/>
        </IconButton>
        <IconButton
          onClick={() => {onOpen(result, availableUrls[1])}}
          color='secondary'
        >
          <BarChartIcon/>
        </IconButton>
      </TableCell>
      }
    </TableRow>
  );
}

class SearchResults extends Component {

  render() {
    const {matches, onOpen, availableUrls} = this.props;
    if (!isNil(matches)) {

    }

    const nUrls = (availableUrls || []).length;

    return (
      <div>
        <List >
          <div style={{paddingBottom: '0.5rem'}}>
            <ListItem>
              <Typography variant='title'>
                Matches
              </Typography>
            </ListItem>
          </div>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Elements</TableCell>
                  <TableCell>Electrolyte</TableCell>
                  <TableCell>pH</TableCell>
                  <TableCell>Plate ID</TableCell>
                  <TableCell>Run ID</TableCell>
                  {nUrls === 2 &&
                  <TableCell></TableCell>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((match, i) => ResultItem({result: match, i, onOpen, availableUrls}))}
              </TableBody>
            </Table>
          </Paper>
        </List>
      </div>
    );
  }
}

export default SearchResults;
