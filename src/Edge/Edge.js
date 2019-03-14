import React, { Component } from "react";
import KeyHandler, { KEYDOWN } from "react-key-handler";
import classnames from "classnames";
import { EditableLabel } from "../EditableLabel";
import BaseEdge from "./BaseEdge";

class Edge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: !this.props.model.data.label
    };
  }
  render() {
    const { model, config } = this.props;
    return (
      <g
        className="edge-group"
        onClick={this.selectEdge}
        onDoubleClick={this.startEditing}
      >
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

        <EditableLabel
          x={model.midPoint.x}
          y={model.midPoint.y}
          withBackground={true}
          label={model.data.label}
          isEditing={this.state.isEditing}
          onChange={this.finishEditing}
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

  startEditing = () => this.setState({ isEditing: true });

  finishEditing = newLabel => {
    this.setState({ isEditing: false });
    this.props.onChangeLabel(this.props.model, newLabel);
  };
}

export default Edge;
