import React, { Component } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover, { PopoverAnimationVertical } from '@material-ui/core/Popover';

import Button from '@material-ui/core/Button';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

class Header extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleOpen = (event) => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const {me} = this.props;
    return (
      <div>
        <Button onClick={this.handleOpen}>
          {me ? me.login : 'user' }
          <DropDownIcon />
        </Button>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          onClose={this.handleClose}
          animation={PopoverAnimationVertical}
        >
          <MenuList>
            <MenuItem onClick={this.props.handleSignOut} >
              <ExitToAppIcon/>
              Sign out
            </MenuItem>
          </MenuList>
        </Popover>
      </div>
    );
  }
}

export default Header;
