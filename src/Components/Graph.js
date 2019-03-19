import {
  select as d3Select,
  event as d3Event,
  mouse as d3Mouse
} from "d3-selection";
import { Node } from "./Node";
import "../styles/Graph.scss";
import config from "../Config";
import classnames from "classnames";
import { Components } from "./Edge";
import React, { Component } from "react";
import { drag as d3Drag } from "d3-drag";
import { zoom as d3Zoom } from "d3-zoom";
import { withStore } from "../Services/Store";
import { Background, ArrowHead, DropShadowFilter } from "./Defs";

class Graph extends Component {
  canvasRef = React.createRef();
  entitiesRef = React.createRef();
  svgRef = React.createRef();

  componentDidMount() {
    const drag = d3Drag()
      .filter(() => {
        return d3Event.type === "mousedown" && d3Event.altKey;
      })
      .container(this.entitiesRef.current)
      .on("start", () =>
        this.props.store.startBoxSelection(d3Event.x, d3Event.y)
      )
      .on("drag", () =>
        this.props.store.resizeBoxSelection(d3Event.x, d3Event.y)
      )
      .on("end", () => this.props.store.endBoxSelection());

    const zoom = d3Zoom()
      .filter(() => {
        return (
          d3Event.type !== "dblclick" &&
          !(d3Event.type === "mousedown" && d3Event.altKey)
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
    const node = this.props.store.createNode(position);
    this.props.store.selectSingleNode(node);
  }

  renderNodes() {
    const { nodes } = this.props.model;
    return nodes.map(node => (
      <Node
        key={node.id}
        nodeId={node.id}
        nodeRadius={config.nodeRadius}
        dropShadowId={config.dropShadowId}
      />
    ));
  }

  renderEdges() {
    const { edges } = this.props.model;
    return edges.map(edge => (
      <Components.Edge key={edge.id} edgeId={edge.id} config={config} />
    ));
  }

  render() {
    const { selectionBox, creationEdge, altKey } = this.props.model;
    return (
      <svg id="graph-root" ref={this.svgRef}>
        <defs>
          <ArrowHead markerSize={config.markerSize} id="edge-arrow" />
          <ArrowHead markerSize={config.markerSize} id="selected-edge-arrow" />
          <DropShadowFilter id={config.dropShadowId} />
        </defs>

        <g
          ref={this.canvasRef}
          onClick={() => this.props.store.deselectAllNodes()}
          className={classnames("canvas", { altKey })}
        >
          <Background />
        </g>

        <g className="entities-container" ref={this.entitiesRef}>
          <g>
            {this.renderEdges()}
            {creationEdge && (
              <Components.BaseEdge config={config} model={creationEdge} />
            )}
          </g>
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
        </g>
      </svg>
    );
  }
}

export default withStore(Graph, store => store.state);
