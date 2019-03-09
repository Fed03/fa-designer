import React, { Component } from "react";
import { PatternCircles } from "@vx/pattern";

class Background extends Component {
  render() {
    return (
      <g>
        <PatternCircles id="circles" height={30} width={30} fill="#bbb" />
        <rect
          x="0"
          y="0"
          width={this.props.width}
          height={this.props.height}
          fill="url('#circles')"
        />
      </g>
    );
  }
}

export default Background;
