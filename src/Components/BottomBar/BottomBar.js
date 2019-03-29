import ActionBar from "./ActionBar";
import Measure from "react-measure";
import "../../styles/BottomBar.scss";
import React, { Component } from "react";
import { Spring } from "react-spring/renderprops";

class BottomBar extends Component {
  elRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      actionBarHeight: 0,
      componentHeight: 0
    };
  }

  render() {
    const { isExpanded } = this.state;
    return (
      <Measure client onResize={this.setComponentHeight}>
        {({ measureRef }) => (
          <Spring
            from={{ mb: -1000 }}
            to={{ mb: isExpanded ? 0 : -this.offCanvasHeight }}
          >
            {style => (
              <section
                ref={measureRef}
                className="bottom-bar"
                style={{ marginBottom: `${style.mb}px` }}
              >
                {this.renderActionBar()}
                <div className="bar-content">{this.props.children}</div>
              </section>
            )}
          </Spring>
        )}
      </Measure>
    );
  }

  toggleBar = () => {
    const { isExpanded } = this.state;
    this.setState({ isExpanded: !isExpanded });
  };

  renderActionBar() {
    return (
      <ActionBar
        onResize={this.setActionBarHeight}
        onFitClick={this.props.onFitClick}
        onDownloadImgClick={this.props.onDownloadImgClick}
        toggleBar={this.toggleBar}
        onAnalyzeDiagram={this.props.onAnalyzeDiagram}
      />
    );
  }

  get offCanvasHeight() {
    const { componentHeight, actionBarHeight } = this.state;
    return componentHeight - actionBarHeight;
  }

  setComponentHeight = ({ client }) => {
    this.setState({ componentHeight: client.height });
  };

  setActionBarHeight = ({ client }) => {
    this.setState({ actionBarHeight: client.height });
  };
}

export default BottomBar;
