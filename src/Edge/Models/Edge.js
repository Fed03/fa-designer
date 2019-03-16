// eslint-disable-next-line no-unused-vars
import { EdgeData } from "./EdgeData";
import { BaseEdge } from "./BaseEdge";

class Edge extends BaseEdge {
  /**
   * @param {EdgeData} data
   * @param {string} pathDefinition
   */
  constructor(id, data, pathDefinition, midPoint) {
    super(id, pathDefinition);
    this.data = data;
    this.selected = false;
    this.midPoint = midPoint;
  }

  get srcNodeId() {
    return this.data.srcNodeId;
  }

  get trgNodeId() {
    return this.data.trgNodeId;
  }

  updateLabel(label) {
    this.data.label = label;
  }

  get isReentrant() {
    return this.srcNodeId === this.trgNodeId;
  }
}

export { Edge };
