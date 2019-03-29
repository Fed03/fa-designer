import "../styles/Drawer.scss";
import React, { Component } from "react";

class Drawer extends Component {
  render() {
    const { width, isOpen, children, drawerContent } = this.props;
    const style = {
      minWidth: `${width}px`
    };
    return (
      <div
        id="drawer-wrapper"
        style={{ transform: `translateX(-${width * (isOpen ? 0 : 1)}px)` }}
      >
        <aside style={style}>{drawerContent}</aside>
        <section>{children}</section>
      </div>
    );
  }
}

export { Drawer };
