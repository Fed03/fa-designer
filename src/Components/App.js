import Graph from "./Graph";
import BottomBar from "./BottomBar";
import React, { Component } from "react";
import KeyHandler, { KEYDOWN, KEYUP } from "react-key-handler";
import { store } from "../Services/Store";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Graph />
        <BottomBar />
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Alt"
          onKeyHandle={() => store.setAltKeyDown()}
        />
        <KeyHandler
          keyEventName={KEYUP}
          keyValue="Alt"
          onKeyHandle={() => store.setAltKeyUp()}
        />
      </React.Fragment>
    );
  }
}

export default App;
