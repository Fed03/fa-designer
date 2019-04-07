import { withContentRect } from "react-measure";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestion,
  faExpand,
  faProjectDiagram,
  faFileImage /*, faTimes*/
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/ActionBar.scss";

class ActionBar extends Component {
  render() {
    return (
      <aside className="action-bar">
        <div className="expansion-icons" onClick={this.props.toggleBar}>
          <FontAwesomeIcon
            icon={faQuestion}
            size="2x"
            fixedWidth
            className="btn-icon icon-default"
          />
          {/* <FontAwesomeIcon
              icon={faTimes}
              size="2x"
              fixedWidth
              className="icon icon-exanded"
            /> */}
        </div>
        <div data-tip="Fit graph" onClick={this.props.onFitClick}>
          <FontAwesomeIcon
            icon={faExpand}
            size="2x"
            fixedWidth
            className="btn-icon"
          />
        </div>
        <div data-tip="Export as PNG" onClick={this.props.onDownloadImgClick}>
          <FontAwesomeIcon
            icon={faFileImage}
            size="2x"
            fixedWidth
            className="btn-icon"
          />
        </div>
        <div data-tip="Analyze Graph" onClick={this.props.onAnalyzeDiagram}>
          <FontAwesomeIcon
            icon={faProjectDiagram}
            size="2x"
            fixedWidth
            className="btn-icon"
          />
        </div>
      </aside>
    );
  }
}

export default withContentRect("client")(
  ({ measure, measureRef, contentRect, ...others }) => (
    <div ref={measureRef}>
      <ActionBar {...others} />
    </div>
  )
);
