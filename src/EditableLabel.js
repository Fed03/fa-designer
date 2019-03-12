import React, { Component } from "react";

const width = 160;
const height = 30;

class EditableLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.label
    };
  }

  render() {
    const { x, y, label } = this.props;
    return (
      <g>
        <text x={x} y={y} textAnchor="middle">
          {label}
        </text>
        {this.renderTextInput()}
      </g>
    );
  }

  renderTextInput() {
    const { x, y, label, isEditing } = this.props;
    if (isEditing) {
      return (
        <foreignObject
          x={x - width / 2}
          y={y - height / 2}
          height={height}
          width={width}
        >
          <input
            autoFocus
            type="text"
            defaultValue={label}
            onInput={e => this.setState({ value: e.target.value })}
            onBlur={this.finishEditing}
            style={{ width: `${width}px`, height: `${height}px` }}
            onKeyPress={this.handleKeyPress}
            className="label-input"
          />
        </foreignObject>
      );
    }
  }

  finishEditing = () => {
    this.props.onChange(this.state.value);
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.finishEditing();
    }
  };
}

export { EditableLabel };
