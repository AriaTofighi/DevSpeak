import React from "react";

import classes from "./Login.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Spinner from "../../components/UI/Spinner/Spinner";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "50%",
    width: "80%",
    maxWidth: "340px",
    padding: "16px",
    fontWeight: "bold",
    fontSize: "35px",
    boxSizing: "border-box",
    position: "absolute",
  },
}));

const Login = (props) => {
  let DividerStyles = {
    margin: "15px 0 10px 0",
  };
  let materialClasses = useStyles();

  return (
    <div className={classes.Login}>
      {props.loading ? (
        <React.Fragment>
          <Backdrop show={true} />
          <Spinner />
        </React.Fragment>
      ) : null}
      <Paper className={materialClasses.paper} elevation={3}>
        Login
        <Divider style={DividerStyles} />
        <form>
          <input className={classes.Input} placeholder="Email"></input>
          <input
            className={classes.Input}
            type="password"
            placeholder="Password"
          ></input>
          <button className={classes.Button}>Login</button>
          <button className={classes.Button} onClick={props.googleLogin}>
            Google Login / Signup
          </button>
        </form>
        <div className={classes.NoAccount}>
          Don't have an account? Sign up{" "}
          <p className={classes.NoAccountLink}>here.</p>
        </div>
      </Paper>
    </div>
  );
};

export default Login;
