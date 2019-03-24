import { withContentRect } from "react-measure";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestion,
  faExpand,
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
            className="icon icon-default"
          />
          {/* <FontAwesomeIcon
              icon={faTimes}
              size="2x"
              fixedWidth
              className="icon icon-exanded"
            /> */}
        </div>
        <div onClick={this.props.onFitClick}>
          <FontAwesomeIcon
            icon={faExpand}
            size="2x"
            fixedWidth
            className="icon"
          />
        </div>
        <div onClick={this.props.onDownloadImgClick}>
          <FontAwesomeIcon
            icon={faFileImage}
            size="2x"
            fixedWidth
            className="icon"
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
