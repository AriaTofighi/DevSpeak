import React from "react";
import classes from "./MessageInput.module.css";

const MessageInput = () => {
  return (
    <div className={classes.MessageInput}>
      <input className={classes.Input} placeholder="Enter a message..." />
      <button className={classes.Button}>Send</button>
    </div>
  );
};

export default MessageInput;
