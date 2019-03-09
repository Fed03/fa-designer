import React, { Component } from "react";
import "./App.css";
// import jsonn from "./dummydata.json";
import { Store } from "./Services/Store";
import { Background } from "./Background";
import { ArrowHead } from "./ArrowHead";
import {
  select as d3Select,
  event as d3Event,
  mouse as d3Mouse
} from "d3-selection";
import { Node } from "./Node";
import config from "./Config";
import { Edge } from "./Edge";
import { drag as d3Drag } from "d3-drag";

class App extends Component {
  svgHeight = 1000;
  svgWidth = 1200;
  svgRef = React.createRef();
  positionConstraints = {
    x: {
      min: config.nodeRadius,
      max: this.svgWidth - config.nodeRadius
    },
    y: {
      min: config.nodeRadius,
      max: this.svgHeight - config.nodeRadius
    }
  };

  constructor(props) {
    super(props);
    this.store = new Store(this, {
      candidateSrcNode: null,
      candidateTrgNode: null
    });
  }

  componentDidMount() {
    const drag = d3Drag()
      .on("start", () => this.store.startBoxSelection(d3Event.x, d3Event.y))
      .on("drag", () => this.store.resizeBoxSelection(d3Event.x, d3Event.y))
      .on("end", () => this.store.endBoxSelection());

    d3Select(this.svgRef.current)
      .on("dblclick", () => this.addNewNode())
      .call(drag);
  }

  addNewNode() {
    const position = d3Mouse(d3Event.currentTarget);
    const node = this.store.createNode(position);
    this.store.selectSingleNode(node);
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
    this.store.translateNode(node, this._calcConstrainedPosition(newPosition));
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
    this.store.selectSingleNode(node);
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
    const { selectionBox } = this.state;
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
          <g>{this.renderNodes()}</g>

          {selectionBox.visible && (
            <rect
              x={selectionBox.x}
              y={selectionBox.y}
              height={selectionBox.height}
              width={selectionBox.width}
              fill="#b2daf7"
              fillOpacity="0.6"
              stroke="#0094ff"
            />
          )}
        </svg>
      </div>
    );
  }

  _calcConstrainedPosition(position) {
    const newPairs = Object.entries(position).map(([k, v]) => {
      let value = v;
      value =
        value < this.positionConstraints[k].min
          ? this.positionConstraints[k].min
          : value;
      value =
        value > this.positionConstraints[k].max
          ? this.positionConstraints[k].max
          : value;

      return { [k]: value };
    });

    return Object.assign({}, ...newPairs);
  }
}

export default App;
