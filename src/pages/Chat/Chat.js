import React from "react";

import Sidebar from "../../components/Navigation/Sidebar/Sidebar";
import Content from "../../containers/Content/Content";
import { useHistory } from "react-router-dom";

const Chat = (props) => {
  let history = useHistory();
  let chat = null;
  if (props.user) {
    chat = (
      <React.Fragment>
        <Sidebar
          show={props.showSidebar}
          hideBackdrop={props.hideBackdrop}
          roomDataList={props.roomDataList}
          user={props.user}
        />
        <Content />
      </React.Fragment>
    );
  } else {
    history.push("/login");
  }

  return chat;
};

export default Chat;
