// @ts-nocheck
import { NodeData } from "../Node/Models/NodeData";
import { Node } from "../Node/Models/Node";
import * as EModels from "../Edge/Models";
import { PathGenerator } from "../Edge/PathGenerator";
import uuid from "uuid/v1";
import config from "../Config";

class Store {
  state = {
    nodes: [],
    edges: []
  };

  constructor(component, initialState = {}) {
    this._component = component;
    component.state = { ...initialState, ...this.state };
  }

  loadPayload(jsonObj) {
    jsonObj.nodes.forEach(({ id, label, isInitial, isFinal, metadata }) => {
      this.nodes.push(new NodeData(id, label, isInitial, isFinal, metadata));
    });

    jsonObj.edges.forEach(({ srcNodeId, trgNodeId, metadata }) => {
      this.edges.push(new EModels.EdgeData(srcNodeId, trgNodeId, metadata));
    });
  }

  createNode([x, y]) {
    const data = new NodeData(uuid(), "", false, false);
    const node = new Node(data, x, y);

    this.state.nodes.push(node);

    this._setState();
    return node;
  }

  removeNode(node) {
    const newNodes = this.state.nodes.filter(n => n.id !== node.id);
    const newEdges = this.state.edges.filter(edge => {
      return !node.isPartOfEdge(edge);
    });

    this.state.nodes = newNodes;
    this.state.edges = newEdges;

    this._setState();
  }

  deselectAllNodes() {
    this.state.nodes.forEach(node => (node.selected = false));
    this._setState();
  }

  selectNode(node) {
    this.deselectAllNodes();
    node.selected = true;

    this._setState();
  }

  addCreationEdge(srcPosition, targetPosition) {
    const path = PathGenerator.creationEdgePath(srcPosition, targetPosition);

    this.state.edges.push(new EModels.BaseEdge(config.edge.creationId, path));
    this._setState();
  }

  translateCreationEdge(srcPosition, targetPosition) {
    const creationEdge = this.state.edges.find(
      x => x.id === config.edge.creationId
    );
    if (!creationEdge) {
      return;
    }

    const path = PathGenerator.creationEdgePath(srcPosition, targetPosition);
    creationEdge.pathDefinition = path;

    this._setState();
  }

  removeCreationEdge() {
    const edgesWithoutCreationOne = this.state.edges.filter(
      edge => edge.id !== config.edge.creationId
    );
    this.state.edges = edgesWithoutCreationOne;
    this._setState();
  }

  createNodesLink(srcNode, trgNode) {
    const path = PathGenerator.edgePath(srcNode.position, trgNode.position);
    const data = new EModels.EdgeData(srcNode.id, trgNode.id);
    this.state.edges.push(new EModels.Edge(uuid(), data, path));

    this._setState();
  }

  translateNode(node, newPosition) {
    if (newPosition) {
      node.position = newPosition;
      this.state.edges
        .filter(e => node.isPartOfEdge(e))
        .forEach(e => this._updateEdgePosition(e));

      this._setState();
    }
  }

  _updateEdgePosition(edge) {
    const srcPosition = this._getNodeById(edge.srcNodeId).position;
    const trgPosition = this._getNodeById(edge.trgNodeId).position;
    const newPath = PathGenerator.edgePath(srcPosition, trgPosition);

    edge.pathDefinition = newPath;
  }

  _getNodeById(id) {
    return this.state.nodes.find(n => n.id === id);
  }

  _setState() {
    this._component.setState({ ...this._component.state, ...this.state });
  }
}

// const store = new Store();
// Object.freeze(store);

export { Store };
