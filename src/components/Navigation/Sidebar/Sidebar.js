import React from "react";

import Divider from "@material-ui/core/Divider";
import UserList from "../../UserList/UserList";
import Backdrop from "../../UI/Backdrop/Backdrop";
import classes from "./Sidebar.module.css";

let DividerStyles = {
  backgroundColor: "#CFBEC9",
  width: "90%",
  margin: "auto",
};

const Sidebar = (props) => {
  return (
    <>
      <Backdrop show={props.show} clicked={props.hideBackdrop} />
      <div
        className={`${classes.Sidebar} ${
          props.show ? classes.Open : classes.Close
        }`}
      >
        <div className={classes.UserInfo}>
          <img
            className={classes.UserPhoto}
            src={props.user.photoURL}
            alt="userPhoto"
          />
          <p className={classes.UserName}>{props.user.displayName}</p>
        </div>
        <Divider style={DividerStyles} />
        <UserList
          chatsWith={props.chatsWith}
          userClicked={(userId) => props.userClicked(userId)}
          user={props.user}
          roomDataList={props.roomDataList}
          currentRoomRef={props.currentRoomRef}
        />
      </div>
    </>
  );
};

export default Sidebar;
