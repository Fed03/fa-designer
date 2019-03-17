import React, { Component } from "react";
import Graph from "./Graph";
import BottomBar from "./BottomBar";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Graph />
        <BottomBar />
      </React.Fragment>
    );
  }
}

export default App;
