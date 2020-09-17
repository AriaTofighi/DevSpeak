import React from "react";

import classes from "./Layout.module.css";
import Chat from "../../pages/Chat/Chat";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { db, auth, provider } from "../../services/firebase";
import { Switch, Redirect, Route, withRouter } from "react-router-dom";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import Login from "../../pages/Login/Login";
import firebase from "firebase";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Spinner from "../../components/UI/Spinner/Spinner";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
  },
});

class Layout extends React.Component {
  state = {
    user: null,
    showSidebar: false,
    loginLoading: false,
    checkingAuth: true,
    users: null,
    chattingWith: {
      id: null,
      name: "",
    },
    chatsWith: [],
    currentRoomRef: null,
    messages: [],
    currentMessage: "",
  };

  componentDidMount() {
    this.listenAuth = auth.onAuthStateChanged((user) => {
      this.setState(
        {
          user,
          checkingAuth: false,
        },
        () => {
          if (user) {
            console.log("user authenticated");
            if (this.state.user && this.props.location.pathname === "/login") {
              this.redirectToChat();
            }
            // Get chatsWith array from db
            db.collection("users")
              .doc(user.uid)
              .onSnapshot((doc) => {
                this.setState({ chatsWith: doc.data().chatsWith });
              });

            // Get all user data
            db.collection("users").onSnapshot((snap) => {
              this.setState(
                {
                  users: snap.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                  })),
                },
                () => {
                  let usersWithRoomInfo = this.state.users.map((user) => {
                    db.collection("rooms")
                      .where("users", "array-contains", this.state.user.uid)
                      .onSnapshot((snap) => {
                        console.log("inside of user list where fucntion");
                        snap.forEach((doc) => {
                          console.log("FOREACH LOOP RUNS");
                          if (doc.data().users.includes(user.id)) {
                            // Should only find one document since only one room between 2 people is made
                            user.latestMessage = doc.data().latestMessage;
                            user.latestTime = doc.data().latestTime;
                            if (user.latestMessage.length > 20) {
                              user.latestMessage = user.latestMessage.substring(
                                0,
                                20
                              );
                            }
                            user.latestMessage = user.latestMessage + "...";
                          }
                          this.setState({ users: [...usersWithRoomInfo] });
                        });
                      });
                    return user;
                  });
                }
              );
            });
          } else {
            // User is not logged in
            this.props.history.push("/login");
          }
        }
      );
    });
  }

  currentMessageChangedHandler = (e) => {
    this.setState({ currentMessage: e.target.value });
  };

  handleMessageKeyDown = (event) => {
    if (event.key === "Enter") {
      this.sendMessage();
    }
  };

  sendMessage = () => {
    let currentDateAndTime = firebase.firestore.Timestamp.now();

    if (this.state.messages.length === 0) {
      db.collection("rooms")
        .doc(this.state.user.uid + this.state.chattingWith.id)
        .set({
          users: [this.state.user.uid, this.state.chattingWith.id],
          latestMessage: this.state.currentMessage,
          lastestTime: currentDateAndTime,
        })
        .then(() => {
          db.collection("rooms")
            .doc(this.state.user.uid + this.state.chattingWith.id)
            .collection("messages")
            .add({
              message: this.state.currentMessage,
              timestamp: currentDateAndTime,
              user: this.state.user.displayName,
              userImage: this.state.user.photoURL,
            })
            .then(() => {
              this.getRoomClickedData(this.state.chattingWith.id);
              this.setState({ currentMessage: "" });
            });
        });
    } else {
      this.state.currentRoomRef
        .collection("messages")
        .add({
          message: this.state.currentMessage,
          timestamp: currentDateAndTime,
          user: this.state.user.displayName,
          userImage: this.state.user.photoURL,
        })
        .then(() => {
          this.state.currentRoomRef.set({
            users: [this.state.user.uid, this.state.chattingWith.id],
            latestMessage: this.state.currentMessage,
            latestTime: currentDateAndTime,
          });
          this.getRoomClickedData(this.state.chattingWith.id);
          this.setState({ currentMessage: "" });
        });
    }
  };

  componentWillUnmount() {
    this.listenAuth();
  }

  sidebarToggleHandler = () => {
    this.setState((prevState) => {
      return { showSidebar: !prevState.showSidebar };
    });
  };

  redirectToChat = () => {
    this.setState({ loginLoading: false }, () => {
      this.props.history.push("/");
    });
  };

  googleLogin = () => {
    this.setState({ loginLoading: true });
    auth
      .signInWithPopup(provider)
      .then((result) => {
        let user = result.user;
        let uniqueUser = result.additionalUserInfo.isNewUser;
        let dbRef = db.collection("users").doc(user.uid);
        this.setState({ user });
        if (uniqueUser) {
          // Add new user data to db
          dbRef
            .set({
              name: user.displayName,
              email: user.email,
              chatsWith: [],
            })
            .catch((error) => {
              console.log(error);
            });
        }
        this.redirectToChat();
      })
      .catch((error) => {
        this.setState({ loginLoading: false });
      });
  };

  signOutHandler = () => {
    this.setState(
      { chattingWith: { id: null, name: null }, messages: [] },
      () => {
        firebase
          .auth()
          .signOut()
          .catch((e) => {
            console.log(e);
          });
      }
    );
  };

  getUserClickedData = (userId) => {
    db.collection("users")
      .doc(userId)
      .get()
      .then((user) => {
        const userData = user.data();
        this.setState({
          chattingWith: {
            id: userId,
            name: userData.name,
          },
        });
      });
  };

  getRoomClickedData = (userId) => {
    // If user clicked and who you're already chatting with is the same, don't re-load messages
    // if (userId === this.state.chattingWith.id) {
    //   return;
    // }
    const comboIds = [
      this.state.user.uid + userId,
      userId + this.state.user.uid,
    ];
    console.log("COMBO IDS", comboIds);

    db.collection("rooms")
      .where(firebase.firestore.FieldPath.documentId(), "in", comboIds)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Room exists, load message data into state
          console.log("room exists");

          querySnapshot.forEach((doc) => {
            // Only one document should match the correct combo id so this will execute once
            this.setState({ currentRoomRef: doc.ref }, () =>
              console.log("current room ref", this.state.currentRoomRef)
            );

            doc.ref
              .collection("messages")
              .orderBy("timestamp", "asc")
              .onSnapshot((snapshot) => {
                this.setState({ messages: [] });
                let messagesStore = [];

                snapshot.forEach((doc) => {
                  messagesStore.push(doc.data());
                });

                this.setState(
                  (prevState) => {
                    return {
                      messages: [...messagesStore],
                    };
                  },
                  () => console.log(this.state.messages)
                );
              });
          });
        } else {
          // Room does not exist, set messages array to empty in state (room not created here,
          // rooms are created when a message is sent to a person whos combo id with local
          // user id adds up to make an id found in the rooms collection. The combo id can be one
          // two concatenations, aString + bString or bString + aString).

          console.log("room does not exist");
          this.setState({ messages: [] });
        }
      });
  };

  userClickedHandler = (userId) => {
    // Get user clicked data and set who you're chatting with in state
    // this.sidebarToggleHandler();
    this.getUserClickedData(userId);
    this.getRoomClickedData(userId);
  };

  render() {
    console.count("counter");
    // console.log(this.props.user);
    let checkingAuthLoader = null;
    if (this.state.checkingAuth) {
      checkingAuthLoader = (
        <>
          <div className={classes.CheckingAuthLoader}>
            <Spinner />
            <Backdrop show showFull />
          </div>
        </>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.Layout}>
          <Route path="/">
            <Toolbar
              user={this.state.user}
              sidebarToggleClicked={this.sidebarToggleHandler}
              signOut={this.signOutHandler}
            />
          </Route>

          {checkingAuthLoader}

          <Switch>
            <Route path="/login" exact>
              <Login
                googleLogin={this.googleLogin}
                loading={this.state.loginLoading}
                user={this.state.user}
              />
            </Route>

            <Route path="/" exact>
              <Chat
                showSidebar={this.state.showSidebar}
                hideBackdrop={this.sidebarToggleHandler}
                messages={this.state.messages}
                roomDataList={this.state.users} // the list of all users with room data (if applicable)
                user={this.state.user}
                userClicked={(userId) => this.userClickedHandler(userId)}
                chattingWith={this.state.chattingWith}
                roomExists={this.state.messages.length > 0}
                chatsWith={this.state.chatsWith}
                sendMessage={this.sendMessage}
                currentMessage={this.state.currentMessage}
                currentMessageChanged={(event) =>
                  this.currentMessageChangedHandler(event)
                }
                handleMessageKeyDown={this.handleMessageKeyDown}
                currentRoomRef={this.state.curentRoomRef}
              />
            </Route>
            <Redirect from="*" to="/" />
          </Switch>
        </div>
      </ThemeProvider>
    );
  }
}

export default withRouter(Layout);
