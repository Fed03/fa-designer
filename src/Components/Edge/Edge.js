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
      isEditing: !this.props.model.edge.data.label
    };
  }
  render() {
    const {
      model: { edge },
      config
    } = this.props;
    if (!edge) return null;
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
          model={edge}
          config={config}
          className={classnames({
            "edge-selected": edge.selected
          })}
        />

        <EditableLabel
          x={edge.midPoint.x}
          y={edge.midPoint.y}
          withBackground={true}
          label={edge.data.label}
          isEditing={this.state.isEditing}
          onChange={this.finishEditing}
        />
      </g>
    );
  }

  selectEdge = () => {
    const {
      model: { edge },
      store
    } = this.props;
    store.selectEdge(edge);
    this.moveToForeGround();
  };

  handleKeyboard = () => {
    const {
      model: { edge },
      store
    } = this.props;
    if (edge.selected) {
      store.removeEdge(edge);
    }
  };

  startEditing = () => {
    if (!this.props.model.analyzeMode) {
      this.setState({ isEditing: true });
    }
  };

  finishEditing = newLabel => {
    const {
      model: { edge },
      store
    } = this.props;

    this.setState({ isEditing: false });
    store.updateLabel(edge, newLabel);
  };

  moveToForeGround() {
    const containerEl = this.containerRef.current;
    containerEl.parentNode.appendChild(containerEl);
  }
}

export default withStore(Edge, (store, props) => ({
  edge: store.getEdgeById(props.edgeId),
  analyzeMode: store.state.analyzeMode
}));
