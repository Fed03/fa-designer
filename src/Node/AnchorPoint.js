import React, { Component } from "react";

class AnchorPoint extends Component {
  render() {
    const { node, ...innerProps } = this.props;
    return <circle className="anchor-point" {...innerProps} />;
  }
}

export default AnchorPoint;
