import React, { Component } from "react";

import Message from "./Message/Message";
import MessageInput from "./MessageInput/MessageInput";
import classes from "./Messages.module.css";
import Divider from "@material-ui/core/Divider";

const DividerStyles = {
  margin: "15px 0 10px 0",
};

class Messages extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = React.createRef();
    console.log(this.props.messages);
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (prevProps.messages.length < this.props.messages.length) {
      const messages = this.messagesRef.current;
      return messages.scrollHeight - messages.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot !== null) {
      const messages = this.messagesRef.current;
      messages.scrollTop = messages.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div className={classes.Messages}>
        <h4 className={classes.Topic}>{this.props.chattingWith.name}</h4>
        <Divider style={DividerStyles} />
        <div
          className={classes.MessagesBody}
          ref={this.messagesRef}
          id="MessagesBody"
        >
          {this.props.messages.length > 0 ? (
            <>
              {this.props.messages.map((message, index) => {
                if (index + 1 === this.props.messages.length) {
                  return (
                    <Message key={index} id="lastMessage" message={message} />
                  );
                }
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
          sendMessage={this.props.sendMessage}
          currentMessage={this.props.currentMessage}
          currentMessageChanged={(event) =>
            this.props.currentMessageChanged(event)
          }
          handleMessageKeyDown={this.props.handleMessageKeyDown}
        />
      </div>
    );
  }
}

export default Messages;
