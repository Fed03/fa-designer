import React, { Component } from "react";

const width = 160;
const height = 30;

class EditableLabel extends Component {
  labelRef = React.createRef();
  bg = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      value: props.label
    };
  }

  componentDidMount() {
    this.setbg();
  }

  componentDidUpdate() {
    this.setbg();
  }

  setbg() {
    if (this._hasBackground) {
      const padding = 4;
      const { x, y, height, width } = this.labelRef.current.getBBox();
      const bg = this.bg.current;

      bg.setAttribute("x", x - padding);
      bg.setAttribute("y", y - padding);
      bg.setAttribute("height", height + padding * 2);
      bg.setAttribute("width", width + padding * 2);
    }
  }

  render() {
    const { x, y, label } = this.props;
    return (
      <g className="editable-input">
        {this._hasBackground && (
          <rect className="editable-input-background" ref={this.bg} />
        )}
        <text ref={this.labelRef} x={x} y={y} textAnchor="middle">
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
    if (this.state.value) {
      this.props.onChange(this.state.value);
    }
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.finishEditing();
    }
  };

  get _hasBackground() {
    return this.props.withBackground && this.props.label;
  }
}

export { EditableLabel };
