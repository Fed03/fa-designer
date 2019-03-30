import React, { Component } from "react";
import "../../styles/Node.scss";
import AnchorPoint from "./AnchorPoint";
import KeyHandler, { KEYDOWN } from "react-key-handler";
import { select as d3Select, event as d3Event } from "d3-selection";
import { drag as d3Drag } from "d3-drag";
import classnames from "classnames";
import { EditableLabel } from "../EditableLabel";
import { withStore } from "../../Services/Store";

class Node extends Component {
  nodeCircleRef = React.createRef();
  containerRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showAnchorPoints: false,
      isEditing: !this.props.model.node.data.label
    };
  }

  componentDidMount() {
    const drag = d3Drag().on("drag", this.handleDrag);

    d3Select(this.nodeCircleRef.current).call(drag);
  }

  handleStartOfEdgeCreation = targetPosition => {
    const {
      model: { node },
      store
    } = this.props;

    store.addCreationEdge(node, targetPosition);
  };

  handleEdgeCreation = targetPosition => {
    const { store } = this.props;

    store.translateCreationEdge(targetPosition);
  };

  handleEndOfEdgeCreation = () => {
    this.props.store.removeCreationEdge();
  };

  createReentrantEdge = () => {
    const {
      model: { node },
      store
    } = this.props;
    store.createReentrantEdge(node);
  };

  handleMouseEnter = () => {
    const {
      model: { node, analyzeMode },
      store
    } = this.props;

    store.setEdgeCandidateTrgNode(node);
    if (!analyzeMode) {
      this.setState({
        showAnchorPoints: true
      });
    }
  };

  handleMouseLeave = () => {
    this.props.store.removeEdgeCandidateTrgNode();
    this.setState({
      showAnchorPoints: false
    });
  };

  handleClick = e => {
    const {
      model: { node },
      store
    } = this.props;
    if (e.altKey) {
      store.toggleFinalNodeFlag(node);
    } else if (e.shiftKey) {
      store.setNodeAsInitial(node);
    }
    this.selectNode();
  };

  handleKeyboard = evt => {
    evt.preventDefault();
    const {
      model: { node },
      store
    } = this.props;

    if (node.selected) {
      store.removeNode(node);
    }
  };

  handleDrag = () => {
    const { dx, dy } = d3Event;
    const {
      model: { node },
      store
    } = this.props;

    this.selectNode();
    store.translateNode(node, { dx, dy });
  };

  startEditing = e => {
    if (!e.altKey && !this.props.model.analyzeMode) {
      this.setState({ isEditing: true });
    }
  };

  finishEditing = newLabel => {
    const {
      model: { node },
      store
    } = this.props;

    this.setState({ isEditing: false });
    store.updateLabel(node, newLabel);
  };

  selectNode() {
    const {
      model: { node },
      store
    } = this.props;

    if (!node.selected) {
      store.selectSingleNode(node);
      this.moveToForeGround();
    }
  }

  moveToForeGround() {
    const containerEl = this.containerRef.current;
    containerEl.parentNode.appendChild(containerEl);
  }

  render() {
    const {
      model: { node, altKey },
      nodeRadius,
      dropShadowId
    } = this.props;
    if (!node) return null;
    return (
      <g
        id={node.id}
        className={classnames("node-group", {
          "node-selected": node.selected,
          isInitial: node.isInitial
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
          className={classnames("node", { altKey })}
          cx={node.x}
          cy={node.y}
          r={nodeRadius}
          onClick={this.handleClick}
          filter={`url(#${dropShadowId})`}
          onDoubleClick={this.startEditing}
        />

        {node.isFinal && (
          <circle
            className="final-node-marker"
            cx={node.x}
            cy={node.y}
            r={nodeRadius * 0.85}
          />
        )}

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
      model: {
        node: { x, y }
      },
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

export default withStore(Node, (store, props) => ({
  node: store.getNodeById(props.nodeId),
  altKey: store.state.altKey,
  analyzeMode: store.state.analyzeMode
}));
