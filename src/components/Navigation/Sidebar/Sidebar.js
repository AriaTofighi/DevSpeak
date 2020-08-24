import React from "react";

import Divider from "@material-ui/core/Divider";
import UserList from "../../UserList/UserList";
import Backdrop from "../../UI/Backdrop/Backdrop";
import classes from "./Sidebar.module.css";

const Sidebar = (props) => {
  let DividerStyles = {
    backgroundColor: "#CFBEC9",
    width: "90%",
    margin: "auto",
  };

  return (
    <React.Fragment>
      <Backdrop show={props.show} clicked={props.hideBackdrop} />
      <div
        className={`${classes.Sidebar} ${
          props.show ? classes.Open : classes.Close
        }`}
      >
        <Divider style={DividerStyles} />
        <UserList
          chatsWith={props.chatsWith}
          userClicked={(userId) => props.userClicked(userId)}
          user={props.user}
          roomDataList={props.roomDataList}
          currentRoomRef={props.currentRoomRef}
        />
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
