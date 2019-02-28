import React, { Component } from "react";
import * as d3Selection from "d3-selection";
import { drag as d3Drag } from "d3-drag";

class AnchorPoint extends Component {
  elementRef = React.createRef();

  componentDidMount() {
    const drag = d3Drag()
      .on("start", this.startEdgeCreation)
      .on("drag", this.createNewEdge)
      .on("end", () => this.props.onEdgeCreationEnd());
    d3Selection.select(this.elementRef.current).call(drag);
  }

  startEdgeCreation = () => {
    this.props.onEdgeCreationStart(AnchorPoint.currentPosition());
  };

  createNewEdge = () => {
    this.props.onEdgeCreation(AnchorPoint.currentPosition());
  };

  render() {
    const {
      node,
      onEdgeCreationStart,
      onEdgeCreation,
      onEdgeCreationEnd,
      ...innerProps
    } = this.props;
    return (
      <circle ref={this.elementRef} className="anchor-point" {...innerProps} />
    );
  }

  static currentPosition() {
    const { x, y } = d3Selection.event;
    return { x, y };
  }
}

export default AnchorPoint;
