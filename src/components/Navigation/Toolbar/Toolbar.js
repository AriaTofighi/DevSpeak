import React from "react";

import MenuIcon from "@material-ui/icons/Menu";
import Hidden from "@material-ui/core/Hidden";
import classes from "./Toolbar.module.css";

const Toolbar = (props) => {
  return (
    <header className={classes.Toolbar}>
      {/* <Hidden xsDown> */}
      <MenuIcon
        className={classes.MenuButton}
        onClick={props.sidebarToggleClicked}
      />
      {/* </Hidden> */}

      <h2 className={classes.Topic}>DevSpeak</h2>
    </header>
  );
};

export default Toolbar;
