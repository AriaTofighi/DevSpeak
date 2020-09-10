import React from "react";
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
import moment from "moment";

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
  console.log(props.roomDataList);
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
      textAlign: "center",
      position: "absolute",
      width: 400,
      maxWidth: "70%",
      backgroundColor: theme.palette.background.paper,
      outline: "none",
      boxShadow: theme.shadows[4],
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      padding: "15px",
      "&:hover": {
        backgroundColor: "#986e89",
      },
      cursor: "pointer",
    },
    topLine: {
      margin: 0,
      padding: 0,
      display: "flex",
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

  let initials;

  // room data list is user data list with also last message / last message time room data if applicable
  const sidebarUsers = props.roomDataList?.flatMap((user) => {
    let userId = user.id;

    if (auth.currentUser.uid === userId || !props.chatsWith.includes(userId)) {
      return [];
    }

    initials = getInitials(user.name);
    return [
      // <React.Fragment key={user.name}>
      <div
        className={materialClasses.root}
        key={user.name}
        onClick={() => props.userClicked(userId)}
      >
        <ListItem className={materialClasses.topLine}>
          <ListItemIcon>
            <Avatar style={AvatarStyles}>{initials}</Avatar>
          </ListItemIcon>
          <ListItemText primary={user.name} />
          {/* <ListItemText primary={user.latestMessage} /> */}
        </ListItem>
        <div className={classes.LatestInfo}>
          <p className={classes.LatestMessage}>{user.latestMessage} </p>
          {user.latestTime ? (
            <p className={classes.LatestTime}>
              {moment(user.latestTime?.toDate().toISOString()).format(
                "YYYY-MM-DD h:mm a"
              )}
            </p>
          ) : null}
        </div>
      </div>,
      // </React.Fragment>
    ];
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

  const allUsers = props.roomDataList?.flatMap((user) => {
    let userId = user.id;
    console.log("chatsWith array", props.chatsWith);

    if (auth.currentUser.uid === userId || props.chatsWith.includes(userId)) {
      return [];
    }
    // console.log("ID List:", userId);
    initials = getInitials(user.name);
    return [
      <ListItem
        button
        key={user.name}
        onClick={() => addToChattingWith(userId)}
      >
        <ListItemIcon>
          <Avatar style={AvatarStyles}>{initials}</Avatar>
        </ListItemIcon>
        <ListItemText primary={user.name} />
      </ListItem>,
    ];
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
