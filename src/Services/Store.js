// @ts-nocheck
import { NodeData } from "../Node/Models/NodeData";
import { Node } from "../Node/Models/Node";
import * as EModels from "../Edge/Models";
import {
  EdgePathGenerator,
  CreationEdgePathGenerator
} from "../Utils/PathGenerator";
import uuid from "uuid/v1";
import config from "../Config";
import { SelectionBox } from "../Utils/SelectionBox";

class Store {
  state = {
    nodes: [],
    edges: [],
    selectionBox: {
      visible: false
    }
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

  selectSingleNode(node) {
    this.deselectAllNodes();
    this._deselectAllEdges();
    node.selected = true;

    this._setState();
  }

  addCreationEdge(srcPosition, targetPosition) {
    const path = new CreationEdgePathGenerator(srcPosition, targetPosition)
      .path;

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

    const path = new CreationEdgePathGenerator(srcPosition, targetPosition)
      .path;
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
    if (!this._existsAnEdgeBetween(srcNode, trgNode)) {
      const path = new EdgePathGenerator(srcNode.position, trgNode.position)
        .path;
      const data = new EModels.EdgeData(srcNode.id, trgNode.id);
      this.state.edges.push(new EModels.Edge(uuid(), data, path));

      this._setState();
    }
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

  startBoxSelection(mouseX, mouseY) {
    const { selectionBox } = this.state;
    this._selectionBox = new SelectionBox(mouseX, mouseY);

    selectionBox.visible = true;
    this.state.selectionBox = {
      ...selectionBox,
      ...this._selectionBox.currentState
    };

    this._setState();
  }

  resizeBoxSelection(mouseX, mouseY) {
    const { selectionBox } = this.state;
    this.state.selectionBox = {
      ...selectionBox,
      ...this._selectionBox.resize(mouseX, mouseY)
    };

    this._setState();
  }

  endBoxSelection() {
    this._deselectAllEdges();
    this.deselectAllNodes();

    this.state.nodes.forEach(node => {
      if (this._selectionBox.containsNode(node)) {
        node.selected = true;
      }
    });

    this.state.selectionBox = {
      visible: false
    };
    this._setState();
  }

  selectEdge(edge) {
    this._deselectAllEdges();
    edge.selected = true;
    this._setState();
  }

  removeEdge(edge) {
    const newEdges = this.state.edges.filter(e => e.id !== edge.id);
    this.state.edges = newEdges;

    this._setState();
  }

  updateLabel(node, label) {
    node.updateLabel(label);
    this._setState();
  }

  _updateEdgePosition(edge) {
    const srcPosition = this._getNodeById(edge.srcNodeId).position;
    const trgPosition = this._getNodeById(edge.trgNodeId).position;
    const newPath = new EdgePathGenerator(srcPosition, trgPosition).path;

    edge.pathDefinition = newPath;
  }

  _getNodeById(id) {
    return this.state.nodes.find(n => n.id === id);
  }

  _setState() {
    this._component.setState({ ...this._component.state, ...this.state });
  }

  _existsAnEdgeBetween(srcNode, trgNode) {
    return !!this.state.edges.find(
      edge => edge.srcNodeId === srcNode.id && edge.trgNodeId === trgNode.id
    );
  }

  _deselectAllEdges() {
    this.state.edges.forEach(e => (e.selected = false));
  }
}

// const store = new Store();
// Object.freeze(store);

export { Store };
