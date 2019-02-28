import React, { Component } from "react";
import "./App.css";
// import jsonn from "./dummydata.json";
import { store } from "./Services/Store";
import { Background } from "./Background";
import { ArrowHead } from "./ArrowHead";
import * as d3Selection from "d3-selection";
import { Group } from "@vx/group";
import { Node } from "./Node";
import config from "./Config";
import { PathGenerator, EdgeComponent } from "./Edge";
import { BaseEdge } from "./Edge/Models";

class App extends Component {
  store = store;
  svgHeight = 1000;
  svgWidth = 1200;
  svgRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      nodes: this.store.nodes,
      edges: []
    };
  }

  componentDidMount() {
    d3Selection
      .select(this.svgRef.current)
      .on("dblclick", () => this.addNewNode());
  }

  addNewNode() {
    const position = d3Selection.mouse(d3Selection.event.currentTarget);
    this.store.createNode(position);

    this.setState({
      nodes: this.store.nodes
    });
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
      />
    ));
  }

  renderEdges() {
    const { edges } = this.state;
    return edges.map(edge => (
      <EdgeComponent key={edge.id} model={edge} config={config} />
    ));
  }

  selectNode(node) {
    this.store.deselectAllNodes();
    node.selected = true;
    this.setState({
      nodes: this.store.nodes
    });
  }

  deleteNode(node) {
    this.store.removeNode(node);
    this.setState({
      nodes: this.store.nodes
    });
  }

  handleStartOfEdgeCreation = (srcNode, targetPosition) => {
    const { edges } = this.state;

    const path = PathGenerator.newEdgePath(srcNode.position, targetPosition);
    edges.push(new BaseEdge(config.edge.creationId, path));

    this.setState({ edges });
  };

  handleEdgeCreation = (srcNode, targetPosition) => {
    const { edges } = this.state;

    const path = PathGenerator.newEdgePath(srcNode.position, targetPosition);
    const creationEdge = edges.find(x => x.id === config.edge.creationId);

    if (!creationEdge) {
      return;
    }

    creationEdge.pathDefinition = path;

    this.setState({ edges });
  };

  handleEndOfEdgeCreation = () => {
    const { edges } = this.state;
    const edgesWithoutCreationOne = edges.filter(
      edge => edge.id !== config.edge.creationId
    );
    this.setState({ edges: edgesWithoutCreationOne });
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
