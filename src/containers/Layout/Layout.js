import React from "react";
// import Typography  from "@material-ui/core/Typography";

import classes from "./Layout.module.css";
import Chat from "../../pages/Chat/Chat";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { db, auth, provider } from "../../services/firebase";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  withRouter,
} from "react-router-dom";
import Home from "../../pages/Home/Home";
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
    // this.setState({ loginLoading: false });
    this.listenAuth = auth.onAuthStateChanged((user) => {
      this.setState(
        {
          user,
          checkingAuth: false,
        },
        () => {
          if (user) {
            if (this.state.user && this.props.location.pathname === "/login") {
              this.redirectToChat();
            }
            // Get chatsWith array from db
            db.collection("users")
              .doc(this.state.user.uid)
              .onSnapshot((doc) => {
                this.setState({ chatsWith: doc.data().chatsWith }, () => {
                  // console.log("chatting with: ", this.state.chatsWith)
                });
              });
          } else {
            // console.log("user not logged in");
            this.props.history.push("/login");
          }
        }
      );
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
        () => {}
      );
    });
  }

  currentMessageChangedHandler = (e) => {
    this.setState({ currentMessage: e.target.value }, () => {
      // console.log("current message: " + this.state.currentMessage)
    });
  };

  handleMessageKeyDown = (event) => {
    if (event.key == "Enter") {
      this.sendMessage();
    }
  };

  sendMessage = () => {
    if (this.state.messages.length === 0) {
      db.collection("rooms")
        .doc(this.state.user.uid + this.state.chattingWith.id)
        .set({
          exists: true,
        })
        .then(() => {
          db.collection("rooms")
            .doc(this.state.user.uid + this.state.chattingWith.id)
            .collection("messages")
            .add({
              message: this.state.currentMessage,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              user: this.state.user.displayName,
              userImage: "https://i.imgur.com/owhNAKK.png",
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
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          user: this.state.user.displayName,
          userImage: "https://i.imgur.com/owhNAKK.png",
        })
        .then(() => {
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
      this.props.history.push("/chat");
    });
  };

  googleLogin = () => {
    // this.setState({ loginLoading: true });
    auth
      .signInWithPopup(provider)
      .then((result) => {
        let user = result.user;
        let uniqueUser = result.additionalUserInfo.isNewUser;
        let dbRef = db.collection("users").doc(user.uid);
        // console.log("logged in successfully");
        this.setState({ user });
        if (uniqueUser) {
          dbRef
            .set({
              name: user.displayName,
              email: user.email,
              chatsWith: [],
            })
            .then(() => {
              // console.log("Added new user to database.");
              this.redirectToChat();
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.redirectToChat();
        }
      })
      .catch((error) => {
        this.setState({ loginLoading: false });
      });
  };

  signOutHandler = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened.
      });
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
    // console.log(comboIds);

    db.collection("rooms")
      .where(firebase.firestore.FieldPath.documentId(), "in", comboIds)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          // Room exists, load message data into state
          // console.log("room exists");

          querySnapshot.forEach((doc) => {
            // Only one document should match the correct combo id so this will loop once
            this.setState({ currentRoomRef: doc.ref }, () =>
              console.log("current room ref", this.state.currentRoomRef)
            );
            doc.ref
              .collection("messages")
              .orderBy("timestamp", "asc")
              .onSnapshot((snapshot) => {
                this.setState({ messages: [] });

                snapshot.forEach((doc) => {
                  this.setState(
                    (prevState) => {
                      return {
                        messages: [...prevState.messages, doc.data()],
                      };
                    },
                    () => console.log(this.state.messages)
                  );
                });
              });
          });
        } else {
          // Room does not exist, make a room and set messages array to empty in state
          console.log("room does not exist");
          this.setState({ messages: [] });
        }
      });
  };

  userClickedHandler = (userId) => {
    // Get user clicked data and set who you're chatting with in state
    this.sidebarToggleHandler();
    this.getUserClickedData(userId);
    this.getRoomClickedData(userId);
  };

  render() {
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
            <Route path="/" exact component={Home} />

            <Route path="/login" exact>
              <Login
                googleLogin={this.googleLogin}
                loading={this.state.loginLoading}
                user={this.state.user}
              />
            </Route>

            <Route path="/chat" exact>
              <Chat
                showSidebar={this.state.showSidebar}
                hideBackdrop={this.sidebarToggleHandler}
                messages={this.state.messages}
                roomDataList={this.state.users} // the list of all users, not room data
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
