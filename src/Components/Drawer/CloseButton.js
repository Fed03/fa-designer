import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class CloseButton extends Component {
  render() {
    return (
      <span onClick={this.props.onClick}>
        <FontAwesomeIcon icon={faTimes} className="btn-icon" />
      </span>
    );
  }
}

export { CloseButton };
