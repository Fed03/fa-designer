class Path {
  constructor(edges) {
    this.edges = edges;
  }

  containsEdge(edge) {
    return this.edges.includes(edge);
  }
}

export { Path };
