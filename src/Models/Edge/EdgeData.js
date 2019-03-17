class EdgeData {
  /**
   * @param {number | string} srcNodeId
   * @param {number | string} trgNodeId
   */
  constructor(srcNodeId, trgNodeId, label, metadata = {}) {
    this.srcNodeId = srcNodeId;
    this.trgNodeId = trgNodeId;
    this.label = label;
    this.metadata = metadata;
  }
}

export { EdgeData };
