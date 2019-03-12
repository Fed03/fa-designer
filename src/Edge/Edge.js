import React, { Component } from "react";
import KeyHandler, { KEYDOWN } from "react-key-handler";
import classnames from "classnames";
import { EditableLabel } from "../EditableLabel";
import BaseEdge from "./BaseEdge";

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
        <BaseEdge
          model={model}
          config={config}
          className={classnames({
            "edge-selected": model.selected
          })}
        />

        {/* <EditableLabel
          x={midPoint.x}
          y={midPoint.y}
          label={model.data.label}
          isEditing={false}
          onChange={this.finishEditing}
        /> */}
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
