class EdgeData {
  /**
   * @param {number | string} srcNodeId
   * @param {number | string} trgNodeId
   */
  constructor(srcNodeId, trgNodeId, metadata = {}) {
    this.srcNodeId = srcNodeId;
    this.trgNodeId = trgNodeId;
    this.metadata = metadata;
  }
}

export { EdgeData };
