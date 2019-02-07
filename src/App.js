import React, { Component } from "react";
import "./App.css";
// import jsonn from "./dummydata.json";
// import { store } from "./Services/Store";
import { Background } from "./Background";
import { ArrowHead } from "./ArrowHead";

class App extends Component {
  // store = store;
  svgHeight = 1000;
  svgWidth = 1200;

  render() {
    return (
      <div>
        <svg width={this.svgWidth} height={this.svgHeight}>
          <defs>
            <ArrowHead markerSize={10} />
          </defs>
          <Background width={this.svgWidth} height={this.svgHeight} />
        </svg>
      </div>
    );
  }
}

export default App;
