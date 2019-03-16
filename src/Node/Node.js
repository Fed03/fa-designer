import React, { Component } from "react";
import AnchorPoint from "./AnchorPoint";
import KeyHandler, { KEYDOWN } from "react-key-handler";
import { select as d3Select, event as d3Event } from "d3-selection";
import { drag as d3Drag } from "d3-drag";
import classnames from "classnames";
import { EditableLabel } from "../EditableLabel";
import { withStore } from "../Services/Store";

class Node extends Component {
  nodeCircleRef = React.createRef();
  containerRef = React.createRef();
  deltaX = 0;
  deltaY = 0;

  constructor(props) {
    super(props);
    this.state = {
      showAnchorPoints: false,
      isEditing: !this.props.model.data.label
    };
  }

  componentDidMount() {
    const drag = d3Drag()
      .on("start", this.handleStartOfDrag)
      .on("drag", this.handleDrag);

    d3Select(this.nodeCircleRef.current).call(drag);
  }

  handleStartOfEdgeCreation = targetPosition => {
    const { model, store } = this.props;

    store.addCreationEdge(model, targetPosition);
  };

  handleEdgeCreation = targetPosition => {
    const { store } = this.props;

    store.translateCreationEdge(targetPosition);
  };

  handleEndOfEdgeCreation = () => {
    this.props.store.removeCreationEdge();
  };

  createReentrantEdge = () => {
    const { model, store } = this.props;
    store.createReentrantEdge(model);
  };

  handleMouseEnter = () => {
    const { model, store } = this.props;

    store.setEdgeCandidateTrgNode(model);
    this.setState({
      showAnchorPoints: true
    });
  };

  handleMouseLeave = () => {
    this.props.store.removeEdgeCandidateTrgNode();
    this.setState({
      showAnchorPoints: false
    });
  };

  handleClick = () => {
    this.selectNode();
  };

  handleKeyboard = evt => {
    evt.preventDefault();
    const { model, store } = this.props;

    if (model.selected) {
      store.removeNode(model);
    }
  };

  handleStartOfDrag = () => {
    const { x, y } = d3Event;
    const currentPos = this.props.model.position;
    this.deltaX = currentPos.x - x;
    this.deltaY = currentPos.y - y;
  };

  handleDrag = () => {
    const { x, y } = d3Event;
    const { model, store } = this.props;

    this.selectNode();
    store.translateNode(model, {
      x: x + this.deltaX,
      y: y + this.deltaY
    });
  };

  startEditing = () => {
    this.setState({ isEditing: true });
  };

  finishEditing = newLabel => {
    const { model, store } = this.props;

    this.setState({ isEditing: false });
    store.updateLabel(model, newLabel);
  };

  selectNode() {
    const { model, store } = this.props;

    if (!model.selected) {
      store.selectSingleNode(model);
      this.moveToForeGround();
    }
  }

  moveToForeGround() {
    const containerEl = this.containerRef.current;
    containerEl.parentNode.appendChild(containerEl);
  }

  render() {
    const { model: node, nodeRadius, dropShadowId } = this.props;
    return (
      <g
        id={node.id}
        className={classnames("node-group", {
          "node-selected": node.selected
        })}
        ref={this.containerRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Delete"
          onKeyHandle={this.handleKeyboard}
        />
        <circle
          cx={node.x}
          cy={node.y}
          r={nodeRadius * 1.5}
          fill="transparent"
          className="node-contour"
        />

        <circle
          ref={this.nodeCircleRef}
          className="node"
          cx={node.x}
          cy={node.y}
          r={nodeRadius}
          onClick={this.handleClick}
          filter={`url(#${dropShadowId})`}
          onDoubleClick={this.startEditing}
        />

        {this.renderAnchorPoints()}

        <EditableLabel
          x={node.x}
          y={node.y}
          label={node.data.label}
          isEditing={this.state.isEditing}
          onChange={this.finishEditing}
        />
      </g>
    );
  }

  renderAnchorPoints() {
    return Array.from(this.anchorsCoords()).map(([x, y], i) => {
      return (
        <AnchorPoint
          key={i}
          onEdgeCreationStart={this.handleStartOfEdgeCreation}
          onEdgeCreation={this.handleEdgeCreation}
          onEdgeCreationEnd={this.handleEndOfEdgeCreation}
          onClick={this.createReentrantEdge}
          display={this.state.showAnchorPoints ? "inline" : "none"}
          cx={x}
          cy={y}
          r={this.anchorPointRadius}
        />
      );
    });
  }

  *anchorsCoords() {
    const {
      model: { x, y },
      nodeRadius
    } = this.props;
    const xCoords = [x - nodeRadius, x + nodeRadius];
    const yCoords = [y - nodeRadius, y + nodeRadius];

    for (const anchorX of xCoords) {
      yield [anchorX, y];
    }

    for (const anchorY of yCoords) {
      yield [x, anchorY];
    }
  }

  get anchorPointRadius() {
    return this.props.nodeRadius * 0.14;
  }
}

export default withStore(Node, (store, props) =>
  store.getNodeById(props.nodeId)
);
