import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  root: {
    flexGrow: 1,
  },
});

const SearchPending = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <LinearProgress className={classes.progress} />
    </div>
  );
}

export default withStyles(styles)(SearchPending);
