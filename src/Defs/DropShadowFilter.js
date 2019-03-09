import React, { Component } from "react";

class DropShadowFilter extends Component {
  render() {
    const { id } = this.props;
    return (
      <filter id={id} height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
        <feOffset dx="3" dy="5" result="offsetblur" />
        <feFlood floodOpacity="0.45" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    );
  }
}

export default DropShadowFilter;
