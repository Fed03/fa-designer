import "../styles/Drawer.scss";
import React, { Component } from "react";
import { Spring } from "react-spring/renderprops";

class Drawer extends Component {
  render() {
    const { width, isOpen, children, drawerContent } = this.props;
    return (
      <Spring
        to={{
          width: isOpen ? `${width}px` : "0px",
          transformX: isOpen ? 0 : -width
        }}
      >
        {style => (
          <div
            id="drawer-wrapper"
            style={{ transform: `translateX(${style.transformX}px)` }}
          >
            <aside style={{ minWidth: `${width}px` }}>{drawerContent}</aside>
            <section style={{ width: `calc(100vw - ${style.width})` }}>
              {children}
            </section>
          </div>
        )}
      </Spring>
    );
  }
}

export { Drawer };
