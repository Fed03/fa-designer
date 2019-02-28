import React, { Component } from "react";
import * as d3Shape from "d3-shape";
import { Point2D, Shapes, Intersection } from "kld-intersections";
import Config from "../Config";

class BaseEdge extends Component {
  static lineFactory = d3Shape
    .line()
    .x(d => d.x)
    .y(d => d.y);

  get pathDefinition() {
    return BaseEdge.lineFactory(this.interpolationPoints);
  }

  get interpolationPoints() {
    return [this.lineOrigin(), new Point2D(...this.props.targetPosition)];
  }

  lineOrigin() {
    const { srcNode, targetPosition } = this.props;

    let srcNodeShape = Shapes.circle(srcNode.x, srcNode.y, Config.nodeRadius);
    let chord = Shapes.line(srcNode.x, srcNode.y, ...targetPosition);

    return Intersection.intersect(srcNodeShape, chord).points[0];
  }

  render() {
    return <path d={this.pathDefinition} />;
  }
}

export default BaseEdge;
