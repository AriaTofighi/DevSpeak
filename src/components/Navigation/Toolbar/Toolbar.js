import React from "react";

import MenuIcon from "@material-ui/icons/Menu";
import classes from "./Toolbar.module.css";

const Toolbar = (props) => {
  return (
    <header className={classes.Toolbar}>
      <MenuIcon
        className={classes.MenuButton}
        onClick={props.sidebarToggleClicked}
      />
      <h2 className={classes.Topic}>Aria Tofighi</h2>
    </header>
  );
};

export default Toolbar;
