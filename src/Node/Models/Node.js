/* eslint-disable no-unused-vars */
import { NodeData } from "./NodeData";
import { Edge } from "../../Edge/Models";

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

  /**
   * @param {Edge} edge
   */
  isPartOfEdge(edge) {
    return edge.srcNodeId === this.id || edge.trgNodeId === this.id;
  }
}

export { Node };
