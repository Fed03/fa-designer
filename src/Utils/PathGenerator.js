import * as d3Shape from "d3-shape";
import { Point2D, Shapes, Intersection, Vector2D } from "kld-intersections";
import config from "../Config";

class EdgePathGenerator {
  static _pathFactory = d3Shape
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3Shape.curveBasis);

  midPointTranslateConstant = 0.12;

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
      this.translatedMidPoint,
      this._edgeTrgPoint
    ];

    return EdgePathGenerator._pathFactory(points);
  }

  get translatedMidPoint() {
    const midPoint = this._calcMidPoint();
    const vector = Vector2D.fromPoints(this._edgeSrcPoint, this._edgeTrgPoint);

    return EdgePathGenerator._perpTranslate(
      vector,
      midPoint,
      -this.midPointTranslateConstant * vector.length()
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
      this._trgCenterPoint.x,
      this._trgCenterPoint.y,
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

class ReentrantEdgePathGenerator {
  numOfInterpolationPoints = 5;

  constructor(centerPosition) {
    this._centerPoint = new Point2D(centerPosition.x, centerPosition.y);

    this._edgeSrcPoint = this._calculateLineOriginPoint();
    this._edgeTrgPoint = this._calculateLineEndPoint();

    this._edgeCenterPoint = this._calcEdgeCenterPoint();
    this._edgeRadius = Vector2D.fromPoints(
      this._edgeCenterPoint,
      this._edgeSrcPoint
    ).length();
    this._angleBias = this._calcAngleBias();
  }

  get path() {
    return EdgePathGenerator._pathFactory(this._interpolationPoints);
  }

  get translatedMidPoint() {
    const p = this._interpolationPoints;
    return p[Math.floor(p.length / 2)];
  }

  _calcAngleBias() {
    const xAxis = new Vector2D(1, 0);
    const otherVector = Vector2D.fromPoints(
      this._edgeCenterPoint,
      this._edgeSrcPoint
    );

    return Math.abs(xAxis.angleBetween(otherVector));
  }

  _calculateLineEndPoint() {
    const r = EdgePathGenerator._markerAwareRadius;

    const y = -(Math.sqrt(2) / 2) * r;
    const x = y;

    return this._centerPoint.add(new Point2D(x, y));
  }

  _calculateLineOriginPoint() {
    const r = config.nodeRadius;

    const y = -(Math.sqrt(2) / 2) * r;
    const x = y * -1;

    return this._centerPoint.add(new Point2D(x, y));
  }

  _calcEdgeCenterPoint() {
    const chord = Vector2D.fromPoints(this._edgeSrcPoint, this._edgeTrgPoint);
    const chordLength = chord.length();

    const x = (this._edgeSrcPoint.x + this._edgeTrgPoint.x) / 2;
    const y =
      this._edgeSrcPoint.y -
      chordLength / (2 * Math.tan(this._angleBetweenInterPoints / 2));

    return new Point2D(x, y);
  }

  get _angleBetweenInterPoints() {
    return (2 * Math.PI) / this.numOfInterpolationPoints;
  }

  get _interpolationPoints() {
    let points = [this._edgeSrcPoint];

    let angle = -this._angleBias;
    for (let i = 0; i < this.numOfInterpolationPoints - 2; i++) {
      angle += this._angleBetweenInterPoints;
      let x = this._edgeRadius * Math.cos(angle);
      let y = -this._edgeRadius * Math.sin(angle);
      points.push(this._edgeCenterPoint.add(new Point2D(x, y)));
    }

    points.push(this._edgeTrgPoint);

    return points;
  }
}

export {
  EdgePathGenerator,
  CreationEdgePathGenerator,
  ReentrantEdgePathGenerator
};
