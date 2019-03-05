import * as d3Shape from "d3-shape";
import { Point2D, Shapes, Intersection } from "kld-intersections";
import config from "../Config";

const PathGenerator = {
  _pathFactory: d3Shape
    .line()
    .x(d => d.x)
    .y(d => d.y),

  _generateInterpolationPoints(srcPosition, trgPosition) {
    return [
      new Point2D(srcPosition.x, srcPosition.y),
      new Point2D(trgPosition.x, trgPosition.y)
    ];
  },

  _calculateLineEndPoint(srcPosition, trgPosition) {
    let trgShape = Shapes.circle(
      trgPosition.x,
      trgPosition.y,
      this._markerAwareRadius
    );
    let chord = Shapes.line(
      srcPosition.x,
      srcPosition.y,
      trgPosition.x,
      trgPosition.y
    );

    let intersection = Intersection.intersect(trgShape, chord);
    if (intersection.status === "Intersection") {
      return intersection.points[0];
    }

    return trgPosition;
  },

  get _markerAwareRadius() {
    const {
      nodeRadius,
      edge: { strokeWidth },
      marker: { markerSize }
    } = config;
    return nodeRadius + (strokeWidth * markerSize) / 2;
  },

  creationEdgePath(srcPosition, trgPosition) {
    return this._pathFactory(
      this._generateInterpolationPoints(srcPosition, trgPosition)
    );
  },

  edgePath(srcPosition, trgPosition) {
    return this._pathFactory(
      this._generateInterpolationPoints(
        srcPosition,
        this._calculateLineEndPoint(srcPosition, trgPosition)
      )
    );
  }
};

Object.freeze(PathGenerator);

export { PathGenerator };
