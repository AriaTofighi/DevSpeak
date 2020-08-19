import React from "react";
import "./App.css";

import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./containers/Layout/Layout";
import StateContext from "./state/StateProvider";

function App() {
  return (
    <Router>
      <div className="App">
        <StateContext.Consumer>
          {(user) => <Layout user={user} />}
        </StateContext.Consumer>
      </div>
    </Router>
  );
}

export default App;
