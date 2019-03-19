import BaseEdge from "./BaseEdge";
import classnames from "classnames";
import React, { Component } from "react";
import { withStore } from "../../Services/Store";
import { EditableLabel } from "../EditableLabel";
import KeyHandler, { KEYDOWN } from "react-key-handler";

class Edge extends Component {
  containerRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isEditing: !this.props.model.data.label
    };
  }
  render() {
    const { model, config } = this.props;
    if (!model) return null;
    return (
      <g
        ref={this.containerRef}
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
    const { model, store } = this.props;
    store.selectEdge(model);
    this.moveToForeGround();
  };

  handleKeyboard = () => {
    const { model, store } = this.props;
    if (model.selected) {
      store.removeEdge(model);
    }
  };

  startEditing = () => this.setState({ isEditing: true });

  finishEditing = newLabel => {
    const { model, store } = this.props;

    this.setState({ isEditing: false });
    store.updateLabel(model, newLabel);
  };

  moveToForeGround() {
    const containerEl = this.containerRef.current;
    containerEl.parentNode.appendChild(containerEl);
  }
}

export default withStore(Edge, (store, props) =>
  store.getEdgeById(props.edgeId)
);
