import React, { Component } from "react";

class Edge extends Component {
  render() {
    const { model, config } = this.props;
    return (
      <path
        d={model.pathDefinition}
        stroke={config.edge.stroke}
        strokeWidth={config.edge.strokeWidth}
        markerEnd={this.markerRef}
        fill="transparent"
      />
    );
  }

  get markerRef() {
    const markerId = this.props.config.marker.elementId;
    return `url(#${markerId})`;
  }
}

export default Edge;
