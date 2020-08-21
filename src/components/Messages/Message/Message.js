import React from "react";

import classes from "./Message.module.css";

const Message = (props) => {
  return (
    <div className={classes.Message}>
      <img className={classes.UserImage} src={props.message.image} />
      <div className={classes.MessageBody}>
        <div className={classes.MessageHeader}>
          {props.message.user}{" "}
          <p className={classes.MessageTimestamp}>
            {new Date(props.message.timestamp?.toDate()).toUTCString()}
          </p>
        </div>
        <p className={classes.MessageText}>{props.message.message}</p>
      </div>
    </div>
  );
};

export default Message;
