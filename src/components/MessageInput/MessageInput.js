import React from "react";
import classes from "./MessageInput.module.css";

const MessageInput = () => {
  return (
    <div className={classes.MessageInput}>
      <input placeholder="Enter a message..." />
      <button>Send</button>
    </div>
  );
};

export default MessageInput;
