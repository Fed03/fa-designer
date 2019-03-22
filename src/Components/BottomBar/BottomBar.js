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
                <div className="bar-content">
                  {/*this.props.children*/}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Officia, accusamus sequi iste dolores iure placeat enim fugiat
                  dolorum, reiciendis possimus maxime dignissimos labore amet
                  optio voluptates nisi voluptatum asperiores, quidem doloribus.
                  Quo, eveniet. Numquam obcaecati minus unde est recusandae, eum
                  error a repellat nisi quos quo ut aspernatur amet minima vero
                  voluptas. Facere non qui, dolorem odit consequuntur nam maxime
                  eligendi, sit corrupti excepturi quasi necessitatibus
                  similique ea magnam ex ducimus! Ea, unde distinctio.
                </div>
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
        toggleBar={this.toggleBar}
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
