import React, { Component } from "react";
import AnchorPoint from "./AnchorPoint";
import KeyHandler, { KEYDOWN } from "react-key-handler";
import { select as d3Select, event as d3Event } from "d3-selection";
import { drag as d3Drag } from "d3-drag";
import classnames from "classnames";
import { EditableLabel } from "../EditableLabel";

class Node extends Component {
  nodeCircleRef = React.createRef();
  containerRef = React.createRef();
  deltaX = 0;
  deltaY = 0;

  constructor(props) {
    super(props);
    this.state = {
      showAnchorPoints: false,
      isEditing: false
    };
  }

  componentDidMount() {
    const drag = d3Drag()
      .on("start", () => {
        const { x, y } = d3Event;
        const currentPos = this.props.model.position;
        this.deltaX = currentPos.x - x;
        this.deltaY = currentPos.y - y;
      })
      .on("drag", this.moveNode);
    d3Select(this.nodeCircleRef.current).call(drag);
  }

  handleEdgeCreation = targetPosition => {
    this.props.onEdgeCreation(this.props.model, targetPosition);
  };

  handleStartOfEdgeCreation = targetPosition => {
    this.props.onEdgeCreationStart(this.props.model, targetPosition);
  };

  handleMouseEnter = () => {
    this.props.onMouseEnter(this.props.model);
    this.setState({
      showAnchorPoints: true
    });
  };

  handleMouseLeave = () => {
    this.props.onMouseLeave(this.props.model);
    this.setState({
      showAnchorPoints: false
    });
  };

  handleClick() {
    this._selectNode();
  }

  _selectNode() {
    if (!this.props.model.selected) {
      this.props.onNodeSelection(this.props.model);
      this._moveToForeGround();
    }
  }

  _moveToForeGround() {
    const containerEl = this.containerRef.current;
    containerEl.parentNode.appendChild(containerEl);
  }

  handleKeyboard(evt) {
    evt.preventDefault();
    if (this.props.model.selected) {
      this.props.onNodeDeletion(this.props.model);
    }
  }

  moveNode = () => {
    const { x, y } = d3Event;
    this._selectNode();
    this.props.onNodeMove(this.props.model, {
      x: x + this.deltaX,
      y: y + this.deltaY
    });
  };

  startEditing = () => {
    this.setState({ isEditing: true });
  };

  finishEditing = newLabel => {
    this.setState({ isEditing: false });
    this.props.onChangeLabel(this.props.model, newLabel);
  };

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
          onKeyHandle={this.handleKeyboard.bind(this)}
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
          onClick={this.handleClick.bind(this)}
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
    const { model } = this.props;
    return Array.from(this.anchorsCoords()).map(([x, y], i) => {
      return (
        <AnchorPoint
          key={i}
          node={model}
          onEdgeCreationStart={this.handleStartOfEdgeCreation}
          onEdgeCreation={this.handleEdgeCreation}
          onEdgeCreationEnd={this.props.onEdgeCreationEnd}
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

export default Node;
