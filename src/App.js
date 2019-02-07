import React, { Component } from "react";
import "./App.css";
// import jsonn from "./dummydata.json";
// import { store } from "./Services/Store";
import { Background } from "./Background";

class App extends Component {
  // store = store;
  svgHeight = 1000;
  svgWidth = 1200;

  render() {
    return (
      <div>
        <svg width={this.svgWidth} height={this.svgHeight}>
          <Background width={this.svgWidth} height={this.svgHeight} />
        </svg>
      </div>
    );
  }
}

export default App;
