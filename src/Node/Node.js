import React, { Component } from "react";
import AnchorPoint from "./AnchorPoint";
import KeyHandler, { KEYDOWN } from "react-key-handler";
import { select as d3Select, event as d3Event } from "d3-selection";
import { drag as d3Drag } from "d3-drag";

class Node extends Component {
  nodeCircleRef = React.createRef();
  containerRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showAnchorPoints: false
    };
  }

  componentDidMount() {
    const drag = d3Drag().on("drag", this.moveNode);
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
    this.props.onNodeMove(this.props.model, { x, y });
  };

  render() {
    const { model: node, nodeRadius } = this.props;
    return (
      <g id={node.id} className="node-group" ref={this.containerRef}>
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Delete"
          onKeyHandle={this.handleKeyboard.bind(this)}
        />
        <circle
          ref={this.nodeCircleRef}
          className="node"
          cx={node.x}
          cy={node.y}
          r={nodeRadius}
          fill={node.selected ? "blue" : "red"}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick.bind(this)}
        />
        {this.renderAnchorPoints()}
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
          //display={this.state.showAnchorPoints ? "inline" : "none"}
          cx={x}
          cy={y}
          r={this.anchorPointRadius}
          fill="green"
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
    return this.props.nodeRadius / 10;
  }
}

export default Node;
