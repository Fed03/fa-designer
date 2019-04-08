import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestion,
  faExpand,
  faProjectDiagram,
  faFileImage
} from "@fortawesome/free-solid-svg-icons";
import "../styles/ActionBar.scss";

class ActionBar extends Component {
  render() {
    return (
      <aside className="action-bar">
        <div
          data-tip="Fit graph"
          className="icon-container"
          onClick={this.props.onFitClick}
        >
          <FontAwesomeIcon
            icon={faExpand}
            size="3x"
            fixedWidth
            className="btn-icon"
          />
        </div>
        <div
          data-tip="Export as PNG"
          className="icon-container"
          onClick={this.props.onDownloadImgClick}
        >
          <FontAwesomeIcon
            icon={faFileImage}
            size="3x"
            fixedWidth
            className="btn-icon"
          />
        </div>
        <div
          data-tip="Analyze Graph"
          className="icon-container"
          onClick={this.props.onAnalyzeDiagram}
        >
          <FontAwesomeIcon
            icon={faProjectDiagram}
            size="3x"
            fixedWidth
            className="btn-icon"
          />
        </div>
        <div
          data-tip="Get started"
          className="icon-container"
          onClick={this.props.toggleBar}
        >
          <FontAwesomeIcon
            icon={faQuestion}
            size="3x"
            fixedWidth
            className="btn-icon icon-default"
          />
        </div>
      </aside>
    );
  }
}

export { ActionBar };
