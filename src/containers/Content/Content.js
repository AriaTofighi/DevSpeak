import React from "react";

import classes from "./Content.module.css";
import Message from "../../components/Message/Message";
import MessageInput from "../../components/MessageInput/MessageInput";

const Content = (props) => {
  return (
    <div className={classes.ContentContainer}>
      <div className={classes.Content}>
        <Message />
        <Message />
        <Message />
        <MessageInput />
      </div>
    </div>
  );
};

export default Content;
