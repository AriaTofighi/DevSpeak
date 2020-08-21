import React from "react";

import classes from "./Content.module.css";
import Messages from "../../components/Messages/Messages";

const Content = (props) => {
  console.log(props.messages.length);
  return (
    <div className={classes.ContentContainer}>
      {props.chattingWith.id !== null ? (
        <Messages
          roomExists={props.roomExists}
          messages={props.messages}
          chattingWith={props.chattingWith}
          sendMessage={props.sendMessage}
          currentMessage={props.currentMessage}
          currentMessageChanged={(event) => props.currentMessageChanged(event)}
          handleMessageKeyDown={props.handleMessageKeyDown}
        />
      ) : (
        <div className={classes.StartChatting}>
          <h3>Click on a user to start chatting!</h3>
        </div>
      )}
    </div>
  );
};

export default Content;
