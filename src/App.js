import React, { Component } from "react";
import "./App.css";
// import jsonn from "./dummydata.json";
import { Store } from "./Services/Store";
import { Background, ArrowHead, DropShadowFilter } from "./Defs";
import {
  select as d3Select,
  event as d3Event,
  mouse as d3Mouse
} from "d3-selection";
import { Node } from "./Node";
import config from "./Config";
import { Components } from "./Edge";
import { drag as d3Drag } from "d3-drag";
import { zoom as d3Zoom } from "d3-zoom";

class App extends Component {
  svgHeight = 1000;
  svgWidth = 1200;

  canvasRef = React.createRef();
  entitiesRef = React.createRef();
  svgRef = React.createRef();

  /* positionConstraints = {
    x: {
      min: config.nodeRadius,
      max: this.svgWidth - config.nodeRadius
    },
    y: {
      min: config.nodeRadius,
      max: this.svgHeight - config.nodeRadius
    }
  }; */

  constructor(props) {
    super(props);
    this.store = new Store(this, {
      candidateSrcNode: null,
      candidateTrgNode: null
    });
  }

  componentDidMount() {
    const drag = d3Drag()
      .filter(() => {
        return d3Event.type !== "mousedown" || !d3Event.altKey;
      })
      .container(this.entitiesRef.current)
      .on("start", () => this.store.startBoxSelection(d3Event.x, d3Event.y))
      .on("drag", () => this.store.resizeBoxSelection(d3Event.x, d3Event.y))
      .on("end", () => this.store.endBoxSelection());

    const zoom = d3Zoom()
      .filter(() => {
        return (
          d3Event.type !== "dblclick" &&
          !(d3Event.type === "mousedown" && !d3Event.altKey)
        );
      })
      .scaleExtent([0.5, 2])
      .on("zoom", () => {
        const transform = d3Event.transform;
        this.entitiesRef.current.setAttribute("transform", transform);
        this.canvasRef.current.setAttribute("transform", transform);
      });

    d3Select(this.svgRef.current).call(zoom);

    d3Select(this.canvasRef.current)
      .on("dblclick", this.addNewNode.bind(this))
      .call(drag);
  }

  addNewNode() {
    const position = d3Mouse(this.entitiesRef.current);
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
        dropShadowId={config.dropShadowId}
        onEdgeCreationStart={this.handleStartOfEdgeCreation}
        onEdgeCreation={this.handleEdgeCreation}
        onEdgeCreationEnd={this.handleEndOfEdgeCreation}
        onNodeSelection={this.selectNode.bind(this)}
        onNodeDeletion={this.deleteNode.bind(this)}
        onMouseEnter={this.handleNodeMouseEnter}
        onMouseLeave={this.handleNodeMouseLeave}
        onNodeMove={this.handleNodeTranslate}
        onChangeLabel={(node, newLabel) =>
          this.store.updateLabel(node, newLabel)
        }
      />
    ));
  }

  handleNodeTranslate = (node, newPosition) => {
    this.store.translateNode(
      node,
      /* this._calcConstrainedPosition(newPosition) */ newPosition
    );
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
      <Components.Edge
        key={edge.id}
        model={edge}
        config={config}
        onClick={edge => this.store.selectEdge(edge)}
        onDeleteKey={edge => this.store.removeEdge(edge)}
        onChangeLabel={(component, newLabel) =>
          this.store.updateLabel(component, newLabel)
        }
      />
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
    const { selectionBox, creationEdge } = this.state;
    return (
      <div>
        <svg ref={this.svgRef} width={this.svgWidth} height={this.svgHeight}>
          <defs>
            <ArrowHead markerSize={config.markerSize} id="edge-arrow" />
            <ArrowHead
              markerSize={config.markerSize}
              id="selected-edge-arrow"
            />
            <DropShadowFilter id={config.dropShadowId} />
          </defs>

          <g ref={this.canvasRef}>
            <Background />
          </g>

          <g ref={this.entitiesRef}>
            {this.renderEdges()}
            {creationEdge && (
              <Components.BaseEdge config={config} model={creationEdge} />
            )}
            {this.renderNodes()}
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
          </g>
        </svg>
      </div>
    );
  }

  /* _calcConstrainedPosition(position) {
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
  } */
}

export default App;
