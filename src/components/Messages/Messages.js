import React from "react";

import Message from "./Message/Message";
import MessageInput from "./MessageInput/MessageInput";
import classes from "./Messages.module.css";
import Divider from "@material-ui/core/Divider";

const Messages = () => {
  let DividerStyles = {
    margin: "15px 0 10px 0",
  };

  return (
    <div className={classes.Messages}>
      <h4 className={classes.Topic}>Aria Tofighi</h4>
      <Divider style={DividerStyles} />
      <Message />
      <Message />
      <Message />
      <MessageInput />
    </div>
  );
};

export default Messages;
