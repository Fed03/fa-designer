import React, { Component } from "react";
import { Group } from "@vx/group";
import { PatternCircles } from "@vx/pattern";

class Background extends Component {
  render() {
    return (
      <Group>
        <PatternCircles id="circles" height={30} width={30} fill="#bbb" />
        <rect
          x="0"
          y="0"
          width={this.props.width}
          height={this.props.height}
          fill="url('#circles')"
        />
      </Group>
    );
  }
}

export default Background;
