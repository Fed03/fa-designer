// eslint-disable-next-line no-unused-vars
import { NodeData } from "./NodeData";

class Node {
  /**
   * @param {NodeData} data
   * @param {number} xCoord
   * @param {number} yCoord
   */
  constructor(data, xCoord, yCoord, isFinal = false) {
    this.data = data;
    this.x = xCoord;
    this.y = yCoord;
    this.isFinal = isFinal;
  }

  get id() {
    return this.data.id;
  }
}

export { Node };
