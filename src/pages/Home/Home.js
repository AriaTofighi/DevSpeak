import React from "react";

import classes from "./Home.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "100%",
    width: "100%",
    padding: "16px",
    fontWeight: "bold",
    fontSize: "35px",
    boxSizing: "border-box",
  },
}));

const Home = () => {
  let materialClasses = useStyles();

  return (
    <div className={classes.Home}>
      <Paper className={materialClasses.paper} elevation={3}>
        Welcome Home
      </Paper>
    </div>
  );
};

export default Home;
