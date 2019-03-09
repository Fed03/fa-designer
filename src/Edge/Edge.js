import React, { Component } from "react";
import KeyHandler, { KEYDOWN } from "react-key-handler";
import classnames from "classnames";

class Edge extends Component {
  render() {
    const { model, config } = this.props;
    return (
      <g className="edge-group" onClick={this.selectEdge}>
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Delete"
          onKeyHandle={this.handleKeyboard}
        />
        <path
          d={model.pathDefinition}
          fill="none"
          stroke="transparent"
          strokeWidth={config.edge.strokeWidth * 5.5}
          className="edge-mouse-handler"
        />

        <path
          d={model.pathDefinition}
          strokeWidth={config.edge.strokeWidth}
          fill="none"
          className={classnames("edge", { "edge-selected": model.selected })}
        />
      </g>
    );
  }

  selectEdge = () => {
    this.props.onClick(this.props.model);
  };

  handleKeyboard = () => {
    const { model } = this.props;
    if (model.selected) {
      this.props.onDeleteKey(this.props.model);
    }
  };
}

export default Edge;
