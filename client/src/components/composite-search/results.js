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
  TableBody
} from '@material-ui/core';

function parseElements(elementsArray) {
  elementsArray = elementsArray.map(el => el.charAt(0).toUpperCase() + el.slice(1));
  return elementsArray.join(', ');
}

const ResultItem = (props) => {
  const {result, i, onOpen} = props;
  return (
    <TableRow key={i} hover style={{cursor: 'pointer'}} onClick={() => {onOpen(result)}}>
      <TableCell>{parseElements(result.platemap.elements)}</TableCell>
      <TableCell>{result.run.electrolyte}</TableCell>
      <TableCell>{result.run.solutionPh}</TableCell>
      <TableCell>{result.platemap.plateId}</TableCell>
      <TableCell>{result.run.runId}</TableCell>
    </TableRow>
  );
}

class SearchResults extends Component {

  render() {
    const {matches, onOpen} = this.props;
    if (!isNil(matches)) {

    }

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
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((match, i) => ResultItem({result: match, i, onOpen}))}
              </TableBody>
            </Table>
          </Paper>
        </List>
      </div>
    );
  }
}

export default SearchResults;
