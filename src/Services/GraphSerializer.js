import { CssExtractor } from "./CssExtractor";

class GraphSerializer {
  constructor(graphElement) {
    this.graphElement = graphElement.cloneNode(true);
    this.rootId = graphElement.id;
  }

  serialize() {
    this.graphElement.setAttribute("xlink", "http://www.w3.org/1999/xlink");
    const styleEl = this._createStyleElement();

    this.graphElement = this._prependChild(this.graphElement, styleEl);

    return new XMLSerializer()
      .serializeToString(this.graphElement)
      .replace(new RegExp(`#${this.rootId} `, "g"), "")
      .replace(/(\w+)?:?xlink=/g, "xmlns:xlink=")
      .replace(/NS\d+:href/g, "xlink:href");
  }

  _prependChild(parent, child) {
    parent.insertBefore(child, parent.children[0]);
    return parent;
  }

  /* _createSvgElement() {
    const svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    svg.setAttribute("xlink", "http://www.w3.org/1999/xlink");
    svg.id = "graph-root";
    svg.setAttribute("width", 4000);
    svg.setAttribute("height", 4000);
    svg.appendChild(this.graphElement);

    return svg;
  } */

  _createStyleElement() {
    const cssRules = this._extractCssRules();

    const styleEl = document.createElement("style");
    styleEl.setAttribute("type", "text/css");
    styleEl.innerHTML = cssRules.join(" ");

    return styleEl;
  }

  _extractCssRules() {
    return new CssExtractor(this.rootId).rulesList();
  }
}

export { GraphSerializer };
