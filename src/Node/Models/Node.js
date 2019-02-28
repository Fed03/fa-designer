// eslint-disable-next-line no-unused-vars
import { NodeData } from "./NodeData";

class Node {
  /**
   * @param {NodeData} data
   * @param {number} xCoord
   * @param {number} yCoord
   */
  constructor(data, xCoord, yCoord) {
    this.data = data;
    this.x = xCoord;
    this.y = yCoord;
    this.selected = false;
  }

  get id() {
    return this.data.id;
  }

  get position() {
    return { x: this.x, y: this.y };
  }
}

export { Node };
