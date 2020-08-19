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
import StateContext from "../../state/StateProvider";
import firebase from "firebase";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
  },
});

class Layout extends React.Component {
  static contextType = StateContext;

  state = {
    showSidebar: false,
    rooms: [],
    user: null,
    loginLoading: false,
    chattingWith: {
      id: null,
      name: "",
    },
  };

  componentDidMount() {
    this.setState({ loginLoading: true });
    this.listenAuth = auth.onAuthStateChanged((user) => {
      this.setState(
        {
          user,
          loginLoading: false,
        },
        () => {
          if (this.state.user && this.props.location.pathname === "/login") {
            this.redirectToChat();
          }
        }
      );
    });

    // Prints out list of all users onto sidebar
    db.collection("users").onSnapshot((snap) => {
      this.setState(
        {
          users: snap.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          })),
        },
        () => {
          console.log(this.state.rooms);
        }
      );
    });
  }

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
    this.setState({ loginLoading: true });
    auth
      .signInWithPopup(provider)
      .then((result) => {
        let user = result.user;
        let uniqueUser = result.additionalUserInfo.isNewUser;
        let dbRef = db.collection("users").doc(user.uid);
        console.log("logged in successfully");
        this.setState({ user });
        if (uniqueUser) {
          dbRef
            .set({
              name: user.displayName,
              email: user.email,
              chatsWith: [],
            })
            .then(() => {
              console.log("Added new user to database.");
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

  userClickedHandler = (userId) => {
    // console.log(userId + "user clicked");
    db.collection("users")
      .doc(userId)
      .get()
      .then((user) => {
        // console.log(user.data());
        const userData = user.data();
        this.setState({
          chattingWith: {
            id: userId,
            name: userData.name,
          },
        });
      });
  };

  render() {
    // console.log(this.props.user);

    let chat = () => (
      <Chat
        showSidebar={this.state.showSidebar}
        hideBackdrop={this.sidebarToggleHandler}
        roomDataList={this.state.users}
        user={this.state.user}
        userClicked={(userId) => this.userClickedHandler(userId)}
        chattingWith={this.state.chattingWith}
      />
    );
    let toolBar = () => (
      <Toolbar
        user={this.state.user}
        sidebarToggleClicked={this.sidebarToggleHandler}
        signOut={this.signOutHandler}
      />
    );
    let login = () => (
      <Login googleLogin={this.googleLogin} loading={this.state.loginLoading} />
    );

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.Layout}>
          <Route path="/" component={toolBar} />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={login} />
            <Route path="/chat" exact component={chat} />
            <Redirect from="*" to="/" />
          </Switch>
        </div>
      </ThemeProvider>
    );
  }
}

export default withRouter(Layout);
