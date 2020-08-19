import React from "react";
// import Typography  from "@material-ui/core/Typography";

import classes from "./Layout.module.css";
import Chat from "../../pages/Chat/Chat";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { db, auth, provider } from "../../services/firebase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  withRouter,
} from "react-router-dom";
import Home from "../../pages/Home/Home";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import Login from "../../pages/Login/Login";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
  },
});

class Layout extends React.Component {
  state = {
    showSidebar: false,
    rooms: [],
    user: null,
    loginLoading: false,
  };

  componentDidMount() {
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

    // db.collection("rooms").onSnapshot((snap) => {
    //   this.setState(
    //     {
    //       rooms: snap.docs.map((doc) => ({
    //         id: doc.id,
    //         name: doc.data().name,
    //       })),
    //     },
    //     () => {
    //       console.log(this.state.rooms);
    //     }
    //   );
    // });
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

  render() {
    let chat = () => (
      <Chat
        showSidebar={this.state.showSidebar}
        hideBackdrop={this.sidebarToggleHandler}
        roomDataList={this.state.users}
        user={this.state.user}
      />
    );
    let toolBar = () => (
      <Toolbar sidebarToggleClicked={this.sidebarToggleHandler} />
    );
    let login = () => (
      <Login googleLogin={this.googleLogin} loading={this.state.loginLoading} />
    );

    return (
      <ThemeProvider theme={theme}>
        <div className={classes.Layout}>
          <Route path="/" component={toolBar} />
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={login} />
          <Route path="/chat" component={chat} />
        </div>
      </ThemeProvider>
    );
  }
}

export default withRouter(Layout);
