// eslint-disable-next-line no-unused-vars
import { EdgeData } from "./EdgeData";
import { BaseEdge } from "./BaseEdge";

class Edge extends BaseEdge {
  /**
   * @param {EdgeData} data
   * @param {string} pathDefinition
   */
  constructor(id, data, pathDefinition) {
    super(id, pathDefinition);
    this.data = data;
    this.selected = false;
  }

  get srcNodeId() {
    return this.data.srcNodeId;
  }

  get trgNodeId() {
    return this.data.trgNodeId;
  }

  isReentrant() {
    return this.srcNodeId === this.trgNodeId;
  }
}

export { Edge };
