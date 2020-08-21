import React from "react";

import classes from "./Home.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const Home = () => {
  // const useStyles = makeStyles((theme) => ({
  //   paper: {
  //     height: "100%",
  //     width: "100%",
  //     padding: "16px",
  //     fontWeight: "bold",
  //     fontSize: "35px",
  //     boxSizing: "border-box",
  //   },
  // }));
  // let materialClasses = useStyles();

  return (
    <div className={classes.Home}>
      Welcome Home
      {/* <Paper className={materialClasses.paper} elevation={3}></Paper> */}
    </div>
  );
};

export default Home;
