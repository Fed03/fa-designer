import React, { Component } from "react";
import AnchorPoint from "./AnchorPoint";

class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAnchorPoints: false
    };
  }

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
    this.props.nodeClicked(this.props.model);
  }

  render() {
    const { model: node, nodeRadius } = this.props;
    return (
      <g id={node.id} className="node-group">
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
          display={this.state.showAnchorPoints ? "inline" : "none"}
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
