import * as d3Shape from "d3-shape";
import { Point2D, Shapes, Intersection, Vector2D } from "kld-intersections";
import config from "../Config";

class EdgePathGenerator {
  static _pathFactory = d3Shape
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3Shape.curveBasis);

  constructor(srcCenterPosition, trgCenterPosition) {
    this._srcCenterPoint = new Point2D(
      srcCenterPosition.x,
      srcCenterPosition.y
    );
    this._trgCenterPoint = new Point2D(
      trgCenterPosition.x,
      trgCenterPosition.y
    );

    this._calcInitialPoints();
  }

  get path() {
    const points = [
      this._edgeSrcPoint,
      this._translatedMidPoint,
      this._edgeTrgPoint
    ];

    return EdgePathGenerator._pathFactory(points);
  }

  get _translatedMidPoint() {
    const midPoint = this._calcMidPoint();
    const vector = Vector2D.fromPoints(this._edgeSrcPoint, this._edgeTrgPoint);

    return EdgePathGenerator._perpTranslate(
      vector,
      midPoint,
      -0.12 * vector.length()
    );
  }

  _calcMidPoint() {
    const midX = (this._edgeSrcPoint.x + this._edgeTrgPoint.x) / 2;
    const midY = (this._edgeSrcPoint.y + this._edgeTrgPoint.y) / 2;
    return new Point2D(midX, midY);
  }

  _calcInitialPoints() {
    const linkVector = Vector2D.fromPoints(
      this._srcCenterPoint,
      this._trgCenterPoint
    );

    const translatedSrcPoint = EdgePathGenerator._perpTranslate(
      linkVector,
      this._srcCenterPoint,
      config.nodeRadius * -0.7
    );
    const translatedTrgPoint = EdgePathGenerator._perpTranslate(
      linkVector,
      this._trgCenterPoint,
      config.nodeRadius * -0.7
    );

    this._edgeSrcPoint = this._calculateLineOriginPoint(
      translatedSrcPoint,
      translatedTrgPoint
    );
    this._edgeTrgPoint = this._calculateLineEndPoint(
      translatedSrcPoint,
      translatedTrgPoint
    );
  }

  _calculateLineOriginPoint(srcPoint, trgPoint) {
    const srcShape = Shapes.circle(
      this._srcCenterPoint.x,
      this._srcCenterPoint.y,
      config.nodeRadius
    );
    return EdgePathGenerator._calculateIntersectionPoint(
      srcPoint,
      trgPoint,
      srcShape
    );
  }

  _calculateLineEndPoint(srcPoint, trgPoint) {
    const trgShape = Shapes.circle(
      trgPoint.x,
      trgPoint.y,
      EdgePathGenerator._markerAwareRadius
    );
    return EdgePathGenerator._calculateIntersectionPoint(
      srcPoint,
      trgPoint,
      trgShape
    );
  }

  static _calculateIntersectionPoint(srcPoint, trgPoint, shape) {
    const chord = Shapes.line(srcPoint.x, srcPoint.y, trgPoint.x, trgPoint.y);

    const intersection = Intersection.intersect(shape, chord);
    if (intersection.status === "Intersection") {
      return intersection.points[0];
    }

    return trgPoint;
  }

  static _perpTranslate(vector, point, units) {
    if (vector.length() > 0) {
      const perpUnitVector = vector.perp().unit();
      return point.add(perpUnitVector.multiply(units));
    }
    return point;
  }

  static get _markerAwareRadius() {
    const {
      nodeRadius,
      edge: { strokeWidth },
      markerSize
    } = config;
    return nodeRadius + (strokeWidth * markerSize) / 2;
  }
}

class CreationEdgePathGenerator extends EdgePathGenerator {
  _calculateLineEndPoint() {
    return this._trgCenterPoint;
  }
}

export { EdgePathGenerator, CreationEdgePathGenerator };
