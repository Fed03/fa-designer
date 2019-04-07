import React, { Component } from "react";
import uuid from "uuid/v1";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import "../../styles/PathsList.scss";

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
    return <ul className="list-group">{pathListItems}</ul>;
  }

  _buildListItem(path) {
    const { selectedPath } = this.state;
    const active = selectedPath === path;
    return (
      <li
        onMouseEnter={() => this._handleMouseEnter(path)}
        onMouseLeave={() => this._handleMouseLeave()}
        onClick={() => this._handleClick(path)}
        key={uuid()}
        className={classnames("list-item-group", "path-item", { active })}
      >
        {this._label(path)}
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

  get _linkingArrow() {
    return <FontAwesomeIcon icon={faChevronRight} className="linking-arrow" />;
  }

  _label(path) {
    const labels = path.edges.map(e => e.data.label);

    const lastIdx = labels.length - 1;
    return labels.reduce((acc, label, idx) => {
      const keyIdx = idx * 2;
      const newAcc = [...acc, <span key={keyIdx}>{label}</span>];

      if (idx !== lastIdx) {
        newAcc.push(<span key={keyIdx + 1}>{this._linkingArrow}</span>);
      }
      return newAcc;
    }, []);
  }
}

export { PathsList };
