// @ts-nocheck

import { Node, NodeData } from "../Models/Node";
import { Edge, EdgeData, BaseEdge } from "../Models/Edge";
import {
  EdgePathGenerator,
  CreationEdgePathGenerator,
  ReentrantEdgePathGenerator
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
    creationEdge: null,
    altKey: false,
    analyzeMode: false,
    nodeSelectedForAnalysis: null
  };
  candidateSrcNode = null;
  candidateTrgNode = null;
  listeners = new Map();

  loadPayload({ nodes, edges }) {
    nodes.forEach(({ data, x, y }) => {
      let nData = new NodeData(
        data.id,
        data.label,
        data.isInitial,
        data.isFinal,
        data.metadata
      );
      this.state.nodes.push(new Node(nData, x, y));
    });

    edges.forEach(({ data, id, midPoint, pathDefinition }) => {
      let eData = new EdgeData(
        data.srcNodeId,
        data.trgNodeId,
        data.label,
        data.metadata
      );
      this.state.edges.push(new Edge(id, eData, pathDefinition, midPoint));
    });
  }

  createNode([x, y]) {
    if (!this.state.analyzeMode) {
      const isInitial = this.state.nodes.length === 0;
      const data = new NodeData(uuid(), null, isInitial, false);
      const node = new Node(data, x, y);

      this.state.nodes.push(node);

      this._setState();
      return node;
    }
  }

  removeNode(node) {
    if (!this.state.analyzeMode) {
      const newNodes = this.state.nodes.filter(n => n.id !== node.id);
      const newEdges = this.state.edges.filter(edge => {
        return !node.isPartOfEdge(edge);
      });

      this.state.nodes = newNodes;
      this.state.edges = newEdges;

      this._setState();
    }
  }

  _deselectAllNodes() {
    this.state.nodes.forEach(node => (node.selected = false));
  }

  selectSingleNode(node) {
    if (!this.state.analyzeMode) {
      this.deselectAll();
      node.selected = true;

      this._setState();
    }
  }

  toggleFinalNodeFlag(node) {
    if (!this.state.analyzeMode) {
      node.isFinal = !node.isFinal;

      this._setState();
    }
  }

  setNodeAsInitial(node) {
    if (!this.state.analyzeMode) {
      this.state.nodes.forEach(n => (n.isInitial = false));
      node.isInitial = true;

      this._setState();
    }
  }

  setEdgeCandidateTrgNode(node) {
    this.candidateTrgNode = node;
  }

  removeEdgeCandidateTrgNode() {
    this.setEdgeCandidateTrgNode(null);
  }

  addCreationEdge(srcNode, targetPosition) {
    if (!this.state.analyzeMode) {
      this.candidateSrcNode = srcNode;

      const path = new CreationEdgePathGenerator(
        srcNode.position,
        targetPosition
      ).path;

      this.state.creationEdge = new BaseEdge(config.edge.creationId, path);
      this._setState();
    }
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
    if (!this.state.analyzeMode) {
      const { candidateSrcNode, candidateTrgNode } = this;
      if (candidateTrgNode) {
        this.createNodesLink(candidateSrcNode, candidateTrgNode);
      }
      this.state.creationEdge = null;
      this.candidateSrcNode = null;
      this._setState();
    }
  }

  createReentrantEdge(node) {
    if (!this._existsAnEdgeBetween(node, node) && !this.state.analyzeMode) {
      const generator = new ReentrantEdgePathGenerator(node.position);
      const data = new EdgeData(node.id, node.id, "");
      this.state.edges.push(
        new Edge(uuid(), data, generator.path, generator.translatedMidPoint)
      );

      this._setState();
    }
  }

  _createNodesLink(srcNode, trgNode) {
    if (!this._existsAnEdgeBetween(srcNode, trgNode) && srcNode !== trgNode) {
      const generator = new EdgePathGenerator(
        srcNode.position,
        trgNode.position
      );
      const data = new EdgeData(srcNode.id, trgNode.id, null);
      this.state.edges.push(
        new Edge(uuid(), data, generator.path, generator.translatedMidPoint)
      );

      this._setState();
    }
  }

  translateNode(node, positionDeltas) {
    if (positionDeltas && !this.state.analyzeMode) {
      const nodesToMove = this.state.nodes.filter(
        n => n.selected && n.id !== node.id
      );
      nodesToMove.push(node);

      nodesToMove.forEach(n => n.moveOfDeltas(positionDeltas));

      const edges = new Set(
        nodesToMove.map(n => this._getEdgesByNode(n)).flat()
      );
      edges.forEach(e => this._updateEdgePosition(e));

      this._setState();
    }
  }

  startBoxSelection(mouseX, mouseY) {
    if (!this.state.analyzeMode) {
      const { selectionBox } = this.state;
      this._selectionBox = new SelectionBox(mouseX, mouseY);

      selectionBox.visible = true;
      this.state.selectionBox = {
        ...selectionBox,
        ...this._selectionBox.currentState
      };

      this._setState();
    }
  }

  resizeBoxSelection(mouseX, mouseY) {
    if (!this.state.analyzeMode) {
      const { selectionBox } = this.state;
      this.state.selectionBox = {
        ...selectionBox,
        ...this._selectionBox.resize(mouseX, mouseY)
      };

      this._setState();
    }
  }

  endBoxSelection() {
    if (!this.state.analyzeMode) {
      this.deselectAll();

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
  }

  selectEdge(edge) {
    if (!this.state.analyzeMode) {
      this.deselectAll();
      edge.selected = true;
      this._setState();
    }
  }

  removeEdge(edge) {
    if (!this.state.analyzeMode) {
      const newEdges = this.state.edges.filter(e => e.id !== edge.id);
      this.state.edges = newEdges;

      this._setState();
    }
  }

  updateLabel(component, label) {
    component.updateLabel(label);
    this._setState();
  }

  _updateEdgePosition(edge) {
    let generator;
    if (edge.isReentrant) {
      const nodePosition = this.getNodeById(edge.srcNodeId).position;
      generator = new ReentrantEdgePathGenerator(nodePosition);
    } else {
      const srcPosition = this.getNodeById(edge.srcNodeId).position;
      const trgPosition = this.getNodeById(edge.trgNodeId).position;
      generator = new EdgePathGenerator(srcPosition, trgPosition);
    }

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

  _getEdgesByNode(node) {
    return this.state.edges.filter(e => node.isPartOfEdge(e));
  }

  addListener(id, callback) {
    this.listeners.set(id, callback);
  }

  removeListener(id) {
    this.listeners.delete(id);
  }

  setAltKeyDown() {
    this.state.altKey = true;
    this._setState();
  }

  setAltKeyUp() {
    this.state.altKey = false;
    this._setState();
  }

  deselectAll() {
    this._deselectAllNodes();
    this._deselectAllEdges();
    this._setState();
  }

  toggleAnalysisMode() {
    this.state.analyzeMode = !this.state.analyzeMode;
    this._setState();
  }

  setNodeSelectedForAnalysis(node) {
    this.state.nodeSelectedForAnalysis = node;
    this._setState();
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
      this.id = uuid();
    }

    componentDidMount() {
      store.addListener(this.id, this.handleChange);
    }

    componentWillUnmount() {
      store.removeListener(this.id);
    }

    handleChange = () => {
      this.setState({
        data: selectData(store, this.props)
      });
    };

    render() {
      const { forwardedRef, ...innerProps } = this.props;
      return (
        <WrappedComponent
          store={store}
          model={this.state.data}
          ref={forwardedRef}
          {...innerProps}
        />
      );
    }
  }

  return React.forwardRef((props, ref) => (
    <WithStore forwardedRef={ref} {...props} />
  ));
}

export { store, withStore };
