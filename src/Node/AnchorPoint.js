import React, { Component } from "react";
import { select as d3Select, event as d3Event } from "d3-selection";
import { drag as d3Drag } from "d3-drag";

class AnchorPoint extends Component {
  elementRef = React.createRef();

  componentDidMount() {
    const drag = d3Drag()
      .filter(() => !d3Event.shiftKey)
      .on("start", this.startEdgeCreation)
      .on("drag", this.createNewEdge)
      .on("end", () => this.props.onEdgeCreationEnd());
    d3Select(this.elementRef.current).call(drag);
  }

  startEdgeCreation = () => {
    this.props.onEdgeCreationStart(AnchorPoint.currentPosition());
  };

  createNewEdge = () => {
    this.props.onEdgeCreation(AnchorPoint.currentPosition());
  };

  createReentrantEdge = e => {
    if (e.shiftKey) {
      this.props.onClick();
    }
  };

  render() {
    const {
      onEdgeCreationStart,
      onEdgeCreation,
      onEdgeCreationEnd,
      onClick,
      ...innerProps
    } = this.props;
    return (
      <circle
        ref={this.elementRef}
        className="anchor-point"
        {...innerProps}
        onClick={this.createReentrantEdge}
      />
    );
  }

  static currentPosition() {
    const { x, y } = d3Event;
    return { x, y };
  }
}

export default AnchorPoint;
