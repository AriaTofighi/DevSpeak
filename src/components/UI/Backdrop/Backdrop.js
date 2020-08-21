import React from "react";

import classes from "./Backdrop.module.css";

const Backdrop = (props) => {
  let attachedClasses = [classes.Backdrop];
  // console.log(props.showFull);

  if (props.showFull) {
    // console.log(props.showFull);
    attachedClasses = [classes.Backdrop, classes.ShowFull];
  }

  return props.show ? (
    <div className={attachedClasses.join(" ")} onClick={props.clicked}></div>
  ) : null;
};

export default Backdrop;
