import React, { Component } from "react";
import KeyHandler, { KEYDOWN } from "react-key-handler";

class Edge extends Component {
  static classes = ["edge"];
  render() {
    const { model, config } = this.props;
    return (
      <g className="edge-group">
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Delete"
          onKeyHandle={this.handleKeyboard}
        />
        <path
          d={model.pathDefinition}
          stroke={config.edge.stroke}
          strokeWidth={config.edge.strokeWidth}
          markerEnd={this.markerRef}
          fill="none"
          onClick={this.selectEdge}
          className={this.className}
        />
      </g>
    );
  }

  get className() {
    let classes = [...Edge.classes];
    if (this.props.model.selected) {
      classes.push("edge-selected");
    }
    return classes.join(" ");
  }

  get markerRef() {
    const markerId = this.props.config.marker.elementId;
    return `url(#${markerId})`;
  }

  selectEdge = () => {
    this.props.onClick(this.props.model);
  };

  handleKeyboard = () => {
    this.props.onDeleteKey(this.props.model);
  };
}

export default Edge;
