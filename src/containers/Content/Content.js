import React from "react";

import classes from "./Content.module.css";

const Content = (props) => {
  return (
    <div className={classes.ContentContainer}>
      <div className={classes.Content}>
        <p>Message 1</p>
        <p>Message 2</p>
        <p>Message 3</p>
      </div>
    </div>
  );
};

export default Content;
