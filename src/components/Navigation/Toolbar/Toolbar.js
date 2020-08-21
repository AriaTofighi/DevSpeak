import React from "react";

import MenuIcon from "@material-ui/icons/Menu";
import classes from "./Toolbar.module.css";
import ToolBarLink from "./ToolbarLink/ToolbarLink";
import { Link, useLocation } from "react-router-dom";

const Toolbar = (props) => {
  let location = useLocation().pathname;
  // console.log(location);
  // console.log(props.user);
  // console.log(location === "/" || "/login");

  const renderLogInOrOut = () => {
    if (props.user) {
      return <ToolBarLink clicked={props.signOut}>Sign Out</ToolBarLink>;
    } else if (location !== "/login") {
      return (
        <ToolBarLink>
          <Link className={classes.Link} to="/login">
            Login
          </Link>
        </ToolBarLink>
      );
    } else {
      return null;
    }
  };

  return (
    <header className={classes.Toolbar}>
      {location === "/" || location === "/login" ? null : (
        <MenuIcon
          className={classes.MenuButton}
          onClick={props.sidebarToggleClicked}
        />
      )}

      <h2 className={classes.DevSpeak}>
        <Link className={classes.Link} to="/">
          DevSpeak
        </Link>
      </h2>
      {renderLogInOrOut()}
    </header>
  );
};

export default Toolbar;
