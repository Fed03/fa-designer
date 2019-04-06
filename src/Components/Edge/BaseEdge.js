import React, { Component } from "react";
import classnames from "classnames";
import "../../styles/Edge.scss";
import { ArrowHead } from "../Defs";
import uuid from "uuid/v1";

class BaseEdge extends Component {
  markerId = uuid();

  render() {
    const { model, config, className } = this.props;
    return (
      <g className={classnames("base-edge-group", className)}>
        <defs>
          <ArrowHead markerSize={config.markerSize} id={this.markerId} />
        </defs>
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
          className="edge"
          markerEnd={`url(#${this.markerId})`}
        />
      </g>
    );
  }
}

export default BaseEdge;
