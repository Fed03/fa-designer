import React, { Component } from "react";
import classnames from "classnames";

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
    const { id, markerSize, className } = this.props;
    return (
      <marker
        id={id}
        viewBox={this.viewBox}
        refX={this.refX}
        orient="auto"
        markerWidth={markerSize}
        markerHeight={markerSize}
        className={classnames("arrow-head", className)}
      >
        <path d={this.pathDefinition} />
      </marker>
    );
  }
}

export default ArrowHead;
