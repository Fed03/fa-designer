import React, { Component } from "react";
import * as d3Selection from "d3-selection";
import { drag as d3Drag } from "d3-drag";
import { currentMousePosition } from "../Utils/d3-utils";

class AnchorPoint extends Component {
  elementRef = React.createRef();

  componentDidMount() {
    const drag = d3Drag().on("drag", () => this.createNewEdge());
    d3Selection.select(this.elementRef.current).call(drag);
  }

  createNewEdge() {
    let { x, y } = d3Selection.event;
    this.props.handleEdgeCreation({ x, y });
  }

  render() {
    const { node, handleEdgeCreation, ...innerProps } = this.props;
    return (
      <circle ref={this.elementRef} className="anchor-point" {...innerProps} />
    );
  }
}

export default AnchorPoint;
