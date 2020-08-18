import React from "react";
// import Typography  from "@material-ui/core/Typography";

import classes from "./Layout.module.css";
import Sidebar from "../../components/Navigation/Sidebar/Sidebar";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import Content from "../Content/Content";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
  },
});

class Layout extends React.Component {
  state = {
    showSidebar: false,
  };

  sidebarToggleHandler = () => {
    this.setState((prevState) => {
      return { showSidebar: !prevState.showSidebar };
    });
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className={classes.Layout}>
          <Sidebar
            show={this.state.showSidebar}
            hideBackdrop={this.sidebarToggleHandler}
          />
          <Toolbar sidebarToggleClicked={this.sidebarToggleHandler} />
          <Content />
        </div>
      </ThemeProvider>
    );
  }
}

export default Layout;
