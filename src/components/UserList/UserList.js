import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase";
import {
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemIcon,
} from "@material-ui/core";
import { auth, db } from "../../services/firebase";
import Divider from "@material-ui/core/Divider";

import classes from "./UserList.module.css";

let DividerStyles = {
  backgroundColor: "#CFBEC9",
  width: "90%",
  margin: "auto",
};

const getInitials = (fullName) => {
  return fullName
    .split(" ")
    .map((name) => name[0])
    .join("");
};

const UserList = (props) => {
  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      outline: "none",
      boxShadow: theme.shadows[4],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const materialClasses = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  let AvatarStyles = {
    backgroundColor: "#986E89",
  };

  let chatsWith = [];
  let initials;

  const sidebarUsers = props.roomDataList?.map((user) => {
    let userId = user.id;

    if (auth.currentUser.uid === userId || !props.chatsWith.includes(userId)) {
      return;
    }

    // console.log("ID List:", userId);
    initials = getInitials(user.name);
    return (
      <ListItem
        button
        key={user.name}
        onClick={() => props.userClicked(userId)}
      >
        <ListItemIcon>
          <Avatar style={AvatarStyles}>{initials}</Avatar>
        </ListItemIcon>
        <ListItemText primary={user.name} />
      </ListItem>
    );
  });

  const addToChattingWith = (userId) => {
    // console.log(userId);
    db.collection("users")
      .doc(auth.currentUser.uid)
      .set(
        {
          chatsWith: firebase.firestore.FieldValue.arrayUnion(userId),
        },
        { merge: true }
      );
    db.collection("users")
      .doc(userId)
      .set(
        {
          chatsWith: firebase.firestore.FieldValue.arrayUnion(
            auth.currentUser.uid
          ),
        },
        { merge: true }
      );
  };

  const allUsers = props.roomDataList?.map((user) => {
    let userId = user.id;
    // console.log(userId, auth.currentUser.uid);

    if (auth.currentUser.uid === userId || props.chatsWith.includes(userId)) {
      return;
    }
    // console.log("ID List:", userId);
    initials = getInitials(user.name);
    return (
      <ListItem
        button
        key={user.name}
        onClick={() => addToChattingWith(userId)}
      >
        <ListItemIcon>
          <Avatar style={AvatarStyles}>{initials}</Avatar>
        </ListItemIcon>
        <ListItemText primary={user.name} />
      </ListItem>
    );
  });

  const body = (
    <div style={modalStyle} className={materialClasses.paper}>
      <h2 id="simple-modal-title">Select a User</h2>
      <div id="simple-modal-description">{allUsers}</div>
    </div>
  );

  return (
    <>
      <List>
        <ListItem button>
          <ListItemText onClick={handleOpen} primary="Start a New Chat" />
          <AddIcon onClick={handleOpen}></AddIcon>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
        </ListItem>{" "}
      </List>
      <Divider style={DividerStyles} />

      <List>{sidebarUsers}</List>
    </>
  );
};

export default UserList;
