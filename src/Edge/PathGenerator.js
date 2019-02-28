import * as d3Shape from "d3-shape";
import { Point2D, Shapes, Intersection } from "kld-intersections";
import Config from "../Config";

const PathGenerator = {
  _pathFactory: d3Shape
    .line()
    .x(d => d.x)
    .y(d => d.y),

  _generateInterpolationPoints(srcPosition, trgPosition) {
    return [
      this._calculateLineOrigin(srcPosition, trgPosition),
      new Point2D(trgPosition.x, trgPosition.y)
    ];
  },

  _calculateLineOrigin(srcPosition, trgPosition) {
    let srcNodeShape = Shapes.circle(
      srcPosition.x,
      srcPosition.y,
      Config.nodeRadius
    );
    let chord = Shapes.line(
      srcPosition.x,
      srcPosition.y,
      trgPosition.x,
      trgPosition.y
    );

    return Intersection.intersect(srcNodeShape, chord).points[0];
  },

  newEdgePath(srcPosition, trgPosition) {
    return this._pathFactory(
      this._generateInterpolationPoints(srcPosition, trgPosition)
    );
  }
};

Object.freeze(PathGenerator);

export { PathGenerator };
