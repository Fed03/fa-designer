import React, { Component } from "react";
import * as d3Selection from "d3-selection";
import { drag as d3Drag } from "d3-drag";

class AnchorPoint extends Component {
  elementRef = React.createRef();
  
  componentDidMount() {
    const drag = d3Drag.on
    d3Selection.select(this.elementRef.current).call(drag);
  }

  render() {
    const { node, ...innerProps } = this.props;
    return <circle ref={this.elementRef} className="anchor-point" {...innerProps} />;
  }
}

export default AnchorPoint;
