import * as d3Shape from "d3-shape";
import { Point2D, Shapes, Intersection, Vector2D } from "kld-intersections";
import config from "../Config";

const PathGenerator = {
  _pathFactory: d3Shape
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3Shape.curveBasis),

  _generateInterpolationPoints(srcPosition, trgPosition) {
    const originPoint = new Point2D(srcPosition.x, srcPosition.y);
    const endPoint = new Point2D(trgPosition.x, trgPosition.y);

    const midPoint = this._calcMidPoint(originPoint, endPoint);
    const vector = Vector2D.fromPoints(originPoint, endPoint);

    const translatedMidPoint = this._perpTranslate(
      vector,
      midPoint,
      -0.12 * vector.length()
    );

    return [originPoint, translatedMidPoint, endPoint];
  },

  _calculateLineEndPoint(srcPosition, trgPosition) {
    let trgShape = Shapes.circle(
      trgPosition.x,
      trgPosition.y,
      this._markerAwareRadius
    );
    return this._calculateIntersectionPoint(srcPosition, trgPosition, trgShape);
  },

  _calculateLineOriginPoint(srcPosition, trgPosition) {
    let srcShape = Shapes.circle(
      srcPosition.x,
      srcPosition.y,
      config.nodeRadius
    );
    return this._calculateIntersectionPoint(srcPosition, trgPosition, srcShape);
  },

  _calculateIntersectionPoint(srcPosition, trgPosition, shape) {
    let chord = Shapes.line(
      srcPosition.x,
      srcPosition.y,
      trgPosition.x,
      trgPosition.y
    );

    let intersection = Intersection.intersect(shape, chord);
    if (intersection.status === "Intersection") {
      return intersection.points[0];
    }

    return trgPosition;
  },

  _calcMidPoint(originPoint, endPoint) {
    const midX = (originPoint.x + endPoint.x) / 2;
    const midY = (originPoint.y + endPoint.y) / 2;
    return new Point2D(midX, midY);
  },

  _perpTranslate(vector, point, units) {
    if (vector.length() > 0) {
      const perpUnitVector = vector.perp().unit();
      return point.add(perpUnitVector.multiply(units));
    }
    return point;
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
      this._generateInterpolationPoints(
        this._calculateLineOriginPoint(srcPosition, trgPosition),
        trgPosition
      )
    );
  },

  edgePath(srcPosition, trgPosition) {
    return this._pathFactory(
      this._generateInterpolationPoints(
        this._calculateLineOriginPoint(srcPosition, trgPosition),
        this._calculateLineEndPoint(srcPosition, trgPosition)
      )
    );
  }
};

Object.freeze(PathGenerator);

export { PathGenerator };
