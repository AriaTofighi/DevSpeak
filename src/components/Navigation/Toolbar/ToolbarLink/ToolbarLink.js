import React from "react";

import classes from "./ToolbarLink.module.css";

const ToolbarLink = (props) => (
  <div className={classes.ToolbarLink} onClick={props.clicked}>
    {props.children}
  </div>
);

export default ToolbarLink;
