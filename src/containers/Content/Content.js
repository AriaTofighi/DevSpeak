import React from "react";

import classes from "./Content.module.css";
import Messages from "../../components/Messages/Messages";

const Content = (props) => {
  return (
    <div className={classes.ContentContainer}>
      <Messages />
    </div>
  );
};

export default Content;
