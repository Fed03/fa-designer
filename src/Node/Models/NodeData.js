class NodeData {
  /**
   * @param {number | string} id
   * @param {string} label
   * @param {boolean} isFinal
   * @param {boolean} isInitial
   */
  constructor(id, label, isInitial, isFinal, metadata = {}) {
    this.id = id;
    this.label = label;
    this.isInitial = isInitial;
    this.metadata = metadata;
    this.isFinal = isFinal;
  }
}

export { NodeData };
