import React from "react";

import classes from "./Login.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import Spinner from "../../components/UI/Spinner/Spinner";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "50%",
    width: "80%",
    maxWidth: "500px",
    padding: "16px",
    fontWeight: "bold",
    boxSizing: "border-box",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
  },
}));

const DividerStyles = {
  margin: "15px 0 10px 0",
};

const Login = (props) => {
  let history = useHistory();
  if (props.user) {
    history.push("/chat");
  }

  const materialClasses = useStyles();

  return (
    <div className={classes.Login}>
      {props.loading ? (
        <>
          <Backdrop show={true} />
          <Spinner />
        </>
      ) : null}
      <Paper className={materialClasses.paper} elevation={3}>
        Login to DevSpeak
        <Divider style={DividerStyles} />
        <button className={classes.Button} onClick={props.googleLogin}>
          Google Login
        </button>
      </Paper>
    </div>
  );
};

export default Login;
