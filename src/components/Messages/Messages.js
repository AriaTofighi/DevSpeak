import React from "react";

import Message from "./Message/Message";
import MessageInput from "./MessageInput/MessageInput";
import classes from "./Messages.module.css";

const Messages = () => {
  return (
    <div className={classes.Messages}>
      <Message />
      <Message />
      <Message />
      <MessageInput />
    </div>
  );
};

export default Messages;
