import React from "react";

import moment from "moment";
import classes from "./Message.module.css";

const Message = (props) => {
  // console.log(props.message);
  return (
    <div className={classes.Message} id={props.id}>
      <img
        className={classes.UserImage}
        src={props.message.userImage}
        alt="userPhoto"
      />
      <div className={classes.MessageBody}>
        <div className={classes.MessageHeader}>
          {props.message.user}{" "}
          <p className={classes.MessageTimestamp}>
            {moment(props.message.timestamp?.toDate().toISOString()).format(
              "YYYY-MM-DD h:mm a"
            )}
          </p>
        </div>
        <p className={classes.MessageText}>{props.message.message}</p>
      </div>
    </div>
  );
};

export default Message;
