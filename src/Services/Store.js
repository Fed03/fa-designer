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
import React, { Component } from "react";

class Store {
  state = {
    nodes: [],
    edges: [],
    selectionBox: {
      visible: false
    },
    creationEdge: null
  };
  candidateSrcNode = null;
  candidateTrgNode = null;
  listeners = [];

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

  setEdgeCandidateTrgNode(node) {
    this.candidateTrgNode = node;
  }

  removeEdgeCandidateTrgNode() {
    this.setEdgeCandidateTrgNode(null);
  }

  addCreationEdge(srcNode, targetPosition) {
    this.candidateSrcNode = srcNode;

    const path = new CreationEdgePathGenerator(srcNode.position, targetPosition)
      .path;

    this.state.creationEdge = new EModels.BaseEdge(
      config.edge.creationId,
      path
    );
    this._setState();
  }

  translateCreationEdge(targetPosition) {
    const { creationEdge } = this.state;
    if (!creationEdge) {
      return;
    }

    const path = new CreationEdgePathGenerator(
      this.candidateSrcNode.position,
      targetPosition
    ).path;
    creationEdge.pathDefinition = path;

    this._setState();
  }

  removeCreationEdge() {
    const { candidateSrcNode, candidateTrgNode } = this;
    if (candidateTrgNode) {
      this.createNodesLink(candidateSrcNode, candidateTrgNode);
    }
    this.state.creationEdge = null;
    this.candidateSrcNode = null;
    this._setState();
  }

  createNodesLink(srcNode, trgNode) {
    if (!this._existsAnEdgeBetween(srcNode, trgNode)) {
      const generator = new EdgePathGenerator(
        srcNode.position,
        trgNode.position
      );
      const data = new EModels.EdgeData(srcNode.id, trgNode.id, "");
      this.state.edges.push(
        new EModels.Edge(
          uuid(),
          data,
          generator.path,
          generator.translatedMidPoint
        )
      );

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
    this.deselectAllNodes();
    edge.selected = true;
    this._setState();
  }

  removeEdge(edge) {
    const newEdges = this.state.edges.filter(e => e.id !== edge.id);
    this.state.edges = newEdges;

    this._setState();
  }

  updateLabel(component, label) {
    component.updateLabel(label);
    this._setState();
  }

  _updateEdgePosition(edge) {
    const srcPosition = this.getNodeById(edge.srcNodeId).position;
    const trgPosition = this.getNodeById(edge.trgNodeId).position;
    const generator = new EdgePathGenerator(srcPosition, trgPosition);

    edge.pathDefinition = generator.path;
    edge.midPoint = generator.translatedMidPoint;
  }

  getNodeById(id) {
    return this.state.nodes.find(n => n.id === id);
  }

  getEdgeById(id) {
    return this.state.edges.find(n => n.id === id);
  }

  _setState() {
    this.listeners.forEach(listener => listener());
  }

  _existsAnEdgeBetween(srcNode, trgNode) {
    return !!this.state.edges.find(
      edge => edge.srcNodeId === srcNode.id && edge.trgNodeId === trgNode.id
    );
  }

  _deselectAllEdges() {
    this.state.edges.forEach(e => (e.selected = false));
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(c => c !== callback);
  }
}

const store = new Store();

function withStore(WrappedComponent, selectData) {
  class WithStore extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: selectData(store, props)
      };
    }

    componentDidMount() {
      store.addListener(this.handleChange);
    }

    componentWillUnmount() {
      store.removeListener(this.handleChange);
    }

    handleChange = () => {
      this.setState({
        data: selectData(store, this.props)
      });
    };

    render() {
      return (
        <WrappedComponent
          store={store}
          model={this.state.data}
          {...this.props}
        />
      );
    }
  }

  return WithStore;
}

export { store, withStore };
