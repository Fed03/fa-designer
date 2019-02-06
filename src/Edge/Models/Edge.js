// eslint-disable-next-line no-unused-vars
import { EdgeData } from "./EdgeData";

class Edge {
  /**
   * @param {EdgeData} data
   * @param {string} pathDefinition
   */
  constructor(data, pathDefinition) {
    this.data = data;
    this.pathDefinition = pathDefinition;
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
