import React from "react";
import classes from "./MessageInput.module.css";

const MessageInput = (props) => {
  return (
    <div className={classes.MessageInput}>
      <input
        value={props.currentMessage}
        onChange={props.currentMessageChanged}
        className={classes.Input}
        placeholder="Enter a message..."
        key="msgInput"
      />
      <button className={classes.Button} onClick={props.sendMessage}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
