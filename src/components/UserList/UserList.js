import React from "react";

import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemIcon,
} from "@material-ui/core";

// import classes from "./UserList.module.css";

const getInitials = (fullName) => {
  return fullName
    .split(" ")
    .map((name) => name[0])
    .join("");
};

const UserList = (props) => {
  let AvatarStyles = {
    backgroundColor: "#986E89",
  };

  let initials;

  const users = props.roomDataList.map((room) => {
    initials = getInitials(room.name);
    return (
      <ListItem button key={room.name}>
        <ListItemIcon>
          <Avatar style={AvatarStyles}>{initials}</Avatar>
        </ListItemIcon>
        <ListItemText primary={room.name} />
      </ListItem>
    );
  });

  return <List>{users}</List>;
};

export default UserList;
