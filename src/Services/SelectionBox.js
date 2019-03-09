export class SelectionBox {
  x = 0;
  y = 0;
  height = 0;
  width = 0;
  constructor(initialX, initialY) {
    this.initialX = this.x = initialX;
    this.initialY = this.y = initialY;
  }
  resize(mouseX, mouseY) {
    this.x = this._calcNewOriginCoord(this.initialX, mouseX);
    this.y = this._calcNewOriginCoord(this.initialY, mouseY);
    this.width = Math.abs(this.initialX - mouseX);
    this.height = Math.abs(this.initialY - mouseY);
    return this.currentState;
  }
  get currentState() {
    return {
      x: this.x,
      y: this.y,
      height: this.height,
      width: this.width
    };
  }
  containsNode(node) {
    const trPoint = this._topRightPoint;
    const brPoint = this._bottomRightPoint;
    const nodePos = node.position;
    return (
      nodePos.x > trPoint.x &&
      nodePos.x < brPoint.x &&
      nodePos.y > trPoint.y &&
      nodePos.y < brPoint.y
    );
  }
  get _bottomRightPoint() {
    return {
      x: this.x + this.width,
      y: this.y + this.height
    };
  }
  get _topRightPoint() {
    return { x: this.x, y: this.y };
  }
  _calcNewOriginCoord(initial, current) {
    const diff = current - initial;
    return diff < 0 ? current : initial;
  }
}
