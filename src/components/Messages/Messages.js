import React from "react";

import Message from "./Message/Message";
import MessageInput from "./MessageInput/MessageInput";
import classes from "./Messages.module.css";
import Divider from "@material-ui/core/Divider";

const Messages = (props) => {
  let DividerStyles = {
    margin: "15px 0 10px 0",
  };

  return (
    <div className={classes.Messages}>
      <h4 className={classes.Topic}>{props.chattingWith.name}</h4>
      <Divider style={DividerStyles} />
      <div className={classes.MessagesBody}>
        {props.roomExists ? (
          <>
            {props.messages.map((message, index) => {
              return <Message key={index} message={message} />;
            })}{" "}
          </>
        ) : (
          <div className={classes.RoomDoesNotExist}>
            Looks like you haven't spoken yet, send a message to get started.
          </div>
        )}
      </div>

      <MessageInput
        key="msgInput"
        sendMessage={props.sendMessage}
        currentMessage={props.currentMessage}
        currentMessageChanged={(event) => props.currentMessageChanged(event)}
        handleMessageKeyDown={props.handleMessageKeyDown}
      />
    </div>
  );
};

export default Messages;
