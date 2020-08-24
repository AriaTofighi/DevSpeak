import React from "react";

import Sidebar from "../../components/Navigation/Sidebar/Sidebar";
import Content from "../../containers/Content/Content";
import { useHistory } from "react-router-dom";

const Chat = (props) => {
  let history = useHistory();
  let chat = null;
  // console.log(props.user);
  if (props.user) {
    chat = (
      <>
        <Sidebar
          show={props.showSidebar}
          hideBackdrop={props.hideBackdrop}
          roomDataList={props.roomDataList}
          user={props.user}
          userClicked={(userId) => props.userClicked(userId)}
          chatsWith={props.chatsWith}
          currentRoomRef={props.currentRoomRef}
        />
        <Content
          roomExists={props.roomExists}
          messages={props.messages}
          chattingWith={props.chattingWith}
          sendMessage={props.sendMessage}
          currentMessage={props.currentMessage}
          currentMessageChanged={(event) => props.currentMessageChanged(event)}
          handleMessageKeyDown={props.handleMessageKeyDown}
        />
      </>
    );
  } else {
    console.log("pushed to login");
    history.push("/login");
  }

  return chat;
};

export default Chat;
