import React, { Component } from "react";
import classnames from "classnames";
import "../../styles/Edge.scss";

class BaseEdge extends Component {
  render() {
    const { model, config, className } = this.props;
    return (
      <g className="base-edge-group">
        <path
          d={model.pathDefinition}
          fill="none"
          stroke="transparent"
          strokeWidth={config.edge.strokeWidth * 5.5}
          className="edge-mouse-handler"
        />

        <path
          d={model.pathDefinition}
          strokeWidth={config.edge.strokeWidth}
          fill="none"
          className={classnames("edge", className)}
        />
      </g>
    );
  }
}

export default BaseEdge;
