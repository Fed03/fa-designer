import { Path } from "../Models/Path";

class AnalysisService {
  adjacencyMap = new Map();

  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
    this.initialNodeId = nodes.find(n => n.isInitial).id;

    this._buildAdjacencyMap();
  }

  getSimplePathsLeadingTo(node) {
    return new DFS(this.adjacencyMap, this.initialNodeId, node.id).run();
  }

  _buildAdjacencyMap() {
    this.nodes.forEach(node => {
      this.adjacencyMap.set(node.id, this._nodeChildrenLinks(node));
    });
  }

  _nodeChildrenLinks(node) {
    return this._exitingEdgesFrom(node).map(e => ({
      id: e.trgNodeId,
      edge: e
    }));
  }

  _exitingEdgesFrom(node) {
    return this.edges.filter(e => !e.isReentrant && e.srcNodeId === node.id);
  }
}

class DFS {
  pathsFound = [];

  constructor(adjacencyMap, initialNodeId, trgNodeId) {
    this.adjacencyMap = adjacencyMap;
    this.initialNodeId = initialNodeId;
    this.trgNodeId = trgNodeId;
  }

  run() {
    this._recursiveDfs(this.initialNodeId, [], []);
    return this.pathsFound;
  }

  _recursiveDfs(nodeId, pathSoFar, nodesAlreadyVisited) {
    const children = this.adjacencyMap.get(nodeId);

    children.forEach(child => {
      if (!nodesAlreadyVisited.includes(child.id)) {
        const newPath = [...pathSoFar, child.edge];
        if (child.id === this.trgNodeId) {
          this.pathsFound.push(new Path(newPath));
        } else {
          this._recursiveDfs(child.id, newPath, [
            ...nodesAlreadyVisited,
            nodeId
          ]);
        }
      }
    });
  }
}

export { AnalysisService };
