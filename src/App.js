import React, { Component } from "react";
import "./App.css";
// import jsonn from "./dummydata.json";
import { Store } from "./Services/Store";
import { Background } from "./Background";
import { ArrowHead } from "./ArrowHead";
import * as d3Selection from "d3-selection";
import { Group } from "@vx/group";
import { Node } from "./Node";
import config from "./Config";
import { Edge } from "./Edge";

class App extends Component {
  svgHeight = 1000;
  svgWidth = 1200;
  svgRef = React.createRef();

  constructor(props) {
    super(props);
    this.store = new Store(this, {
      candidateSrcNode: null,
      candidateTrgNode: null
    });
  }

  componentDidMount() {
    d3Selection
      .select(this.svgRef.current)
      .on("dblclick", () => this.addNewNode());
  }

  addNewNode() {
    const position = d3Selection.mouse(d3Selection.event.currentTarget);
    const node = this.store.createNode(position);
    this.store.selectNode(node);
  }

  renderNodes() {
    const { nodes } = this.state;
    return nodes.map(node => (
      <Node
        key={node.id}
        model={node}
        nodeRadius={config.nodeRadius}
        onEdgeCreationStart={this.handleStartOfEdgeCreation}
        onEdgeCreation={this.handleEdgeCreation}
        onEdgeCreationEnd={this.handleEndOfEdgeCreation}
        onNodeSelection={this.selectNode.bind(this)}
        onNodeDeletion={this.deleteNode.bind(this)}
        onMouseEnter={this.handleNodeMouseEnter}
        onMouseLeave={this.handleNodeMouseLeave}
        onNodeMove={this.handleNodeTranslate}
      />
    ));
  }

  handleNodeTranslate = (node, newPosition) => {
    this.store.translateNode(node, newPosition);
  };

  handleNodeMouseEnter = node => {
    this.setState({ candidateTrgNode: node });
  };

  handleNodeMouseLeave = () => {
    this.setState({ candidateTrgNode: null });
  };

  renderEdges() {
    const { edges } = this.state;
    return edges.map(edge => (
      <Edge key={edge.id} model={edge} config={config} />
    ));
  }

  selectNode(node) {
    this.store.selectNode(node);
  }

  deleteNode(node) {
    this.store.removeNode(node);
  }

  handleStartOfEdgeCreation = (srcNode, targetPosition) => {
    this.store.addCreationEdge(srcNode.position, targetPosition);
    this.setState({ candidateSrcNode: srcNode });
  };

  handleEdgeCreation = (srcNode, targetPosition) => {
    this.store.translateCreationEdge(srcNode.position, targetPosition);
  };

  handleEndOfEdgeCreation = () => {
    this.store.removeCreationEdge();

    const { candidateSrcNode, candidateTrgNode } = this.state;
    if (candidateTrgNode) {
      this.store.createNodesLink(candidateSrcNode, candidateTrgNode);
    }
  };

  render() {
    return (
      <div>
        <svg ref={this.svgRef} width={this.svgWidth} height={this.svgHeight}>
          <defs>
            <ArrowHead
              markerSize={config.marker.markerSize}
              id={config.marker.elementId}
              markerColor={config.edge.stroke}
            />
          </defs>
          <Background width={this.svgWidth} height={this.svgHeight} />

          <g>{this.renderEdges()}</g>
          <Group>{this.renderNodes()}</Group>
        </svg>
      </div>
    );
  }
}

export default App;
