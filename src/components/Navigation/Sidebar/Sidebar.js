import React from "react";

import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsIcon from "@material-ui/icons/Settings";
import ForumIcon from "@material-ui/icons/Forum";
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
        {/* Menu */}

        <List>
          {["Feed", "Settings"].map((text, index) => (
            <ListItem
              button
              key={text}
              style={{ fontFamily: "Times New Roman" }}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <ForumIcon /> : <SettingsIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider style={DividerStyles} />
        <UserList
          chatsWith={props.chatsWith}
          userClicked={(userId) => props.userClicked(userId)}
          user={props.user}
          roomDataList={props.roomDataList}
        />
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
