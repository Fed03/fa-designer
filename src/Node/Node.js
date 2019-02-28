import React, { Component } from "react";
import AnchorPoint from "./AnchorPoint";
import KeyHandler, { KEYDOWN } from "react-key-handler";

class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAnchorPoints: false
    };
  }

  handleEdgeCreation = targetPosition => {
    this.props.onEdgeCreation(this.props.model, targetPosition);
  };

  handleStartOfEdgeCreation = targetPosition => {
    this.props.onEdgeCreationStart(this.props.model, targetPosition);
  };

  handleMouseEnter() {
    this.setState({
      showAnchorPoints: true
    });
  }

  handleMouseLeave() {
    this.setState({
      showAnchorPoints: false
    });
  }

  handleClick() {
    if (!this.props.model.selected) {
      this.props.onNodeSelection(this.props.model);
    }
  }

  handleKeyboard(evt) {
    evt.preventDefault();
    if (this.props.model.selected) {
      this.props.onNodeDeletion(this.props.model);
    }
  }

  render() {
    const { model: node, nodeRadius } = this.props;
    return (
      <g id={node.id} className="node-group">
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Delete"
          onKeyHandle={this.handleKeyboard.bind(this)}
        />
        <circle
          className="node"
          cx={node.x}
          cy={node.y}
          r={nodeRadius}
          fill={node.selected ? "blue" : "red"}
          onMouseEnter={this.handleMouseEnter.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}
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
