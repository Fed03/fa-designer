import React, { Component } from "react";
import uuid from "uuid/v1";
import classnames from "classnames";

class PathsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inToggleMode: false,
      selectedPath: null
    };
  }

  render() {
    const { paths } = this.props;
    const pathListItems = paths.map(path => this._buildListItem(path));
    return <ol>{pathListItems}</ol>;
  }

  _buildListItem(path) {
    const { selectedPath } = this.state;

    const label = path.edges.map(e => e.data.label).join("->");
    return (
      <li
        onMouseEnter={() => this._handleMouseEnter(path)}
        onMouseLeave={() => this._handleMouseLeave()}
        onClick={() => this._handleClick(path)}
        key={uuid()}
        className={classnames({ selectedPath })}
      >
        {label}
      </li>
    );
  }

  _handleClick(path) {
    const { inToggleMode, selectedPath } = this.state;
    if (!inToggleMode || selectedPath !== path) {
      this.setState({ inToggleMode: true, selectedPath: path });
      this.props.onPathSelection(path);
    } else {
      this.setState({ inToggleMode: false, selectedPath: null });
    }
  }

  _handleMouseEnter(path) {
    if (!this.state.inToggleMode) {
      this.props.onPathSelection(path);
    }
  }

  _handleMouseLeave() {
    if (!this.state.inToggleMode) {
      this.props.onPathBlur();
    }
  }
}

export { PathsList };
