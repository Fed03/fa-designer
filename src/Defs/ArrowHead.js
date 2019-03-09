import React, { Component } from "react";

class ArrowHead extends Component {
  get viewBox() {
    const { markerSize } = this.props;
    return `0 -${markerSize / 2} ${markerSize} ${markerSize}`;
  }

  get refX() {
    return this.props.markerSize / 2;
  }

  get pathDefinition() {
    const { markerSize } = this.props;
    return `M0,-${markerSize / 2}L${markerSize},0L0,${markerSize / 2}`;
  }

  render() {
    return (
      <marker
        id={this.props.id}
        viewBox={this.viewBox}
        refX={this.refX}
        orient="auto"
        markerWidth={this.props.markerSize}
        markerHeight={this.props.markerSize}
      >
        <path d={this.pathDefinition} />
      </marker>
    );
  }
}

export default ArrowHead;
