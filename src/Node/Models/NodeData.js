class NodeData {
  /**
   * @param {number | string} id
   * @param {string} label
   */
  constructor(id, label, metadata = {}) {
    this.id = id;
    this.label = label;
    this.metadata = metadata;
  }
}

export { NodeData };
