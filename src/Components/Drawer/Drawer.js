import "../../styles/Drawer.scss";
import React, { Component } from "react";
import { Spring } from "react-spring/renderprops";
import { CloseButton } from "./CloseButton";

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
            <aside className="drawer" style={{ minWidth: `${width}px` }}>
              {drawerContent(this.closeBtn)}
            </aside>
            <section style={{ width: `calc(100vw - ${style.width})` }}>
              {children}
            </section>
          </div>
        )}
      </Spring>
    );
  }

  closeBtn = <CloseButton onClick={this.props.closeDrawer} />;
}

export { Drawer };
