import React from "react";

import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemIcon,
} from "@material-ui/core";

// import classes from "./UserList.module.css";

const UserList = () => {
  let AvatarStyles = {
    backgroundColor: "#986E89",
  };
  let userNames = [
    "Aria Tofighi",
    "Arash Saadati",
    "Stefano Reale",
    "Trevor Lee",
  ];
  let initials;

  let users = userNames.map((fullName, index) => {
    initials = fullName
      .split(" ")
      .map((name) => name[0])
      .join("");
    return (
      <ListItem button key={fullName}>
        <ListItemIcon>
          <Avatar style={AvatarStyles}>{initials}</Avatar>
        </ListItemIcon>
        <ListItemText primary={fullName} />
      </ListItem>
    );
  });

  return <List>{users}</List>;
};

export default UserList;
