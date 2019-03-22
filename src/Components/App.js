import Graph from "./Graph";
import BottomBar from "./BottomBar";
import React, { Component } from "react";
import KeyHandler, { KEYDOWN, KEYUP } from "react-key-handler";
import { store } from "../Services/Store";
import config from "../Config";
import { zoomIdentity } from "d3-zoom";
import { select as d3Select } from "d3-selection";

class App extends Component {
  GraphRef = React.createRef();
  render() {
    return (
      <React.Fragment>
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Alt"
          onKeyHandle={() => store.setAltKeyDown()}
        />
        <KeyHandler
          keyEventName={KEYUP}
          keyValue="Alt"
          onKeyHandle={() => store.setAltKeyUp()}
        />
        <Graph ref={this.GraphRef} />
        <BottomBar onFitClick={this.fitEntities} />
      </React.Fragment>
    );
  }

  fitEntities = () => {
    const { svgRef, entitiesRef } = this.GraphRef.current;

    const transformDefinition = {
      x: 0,
      y: 0,
      k: 1
    };

    const boxInfos = entitiesRef.current.getBBox();
    if (this.thereAreEntities(boxInfos)) {
      const svgDimesions = {
        height: svgRef.current.clientHeight,
        width: svgRef.current.clientWidth
      };

      transformDefinition.k = this.calcNextK(svgDimesions, boxInfos);

      const entitiesCenter = this.getBoxCenter(boxInfos);
      transformDefinition.x =
        svgDimesions.width / 2 - entitiesCenter.x * transformDefinition.k;
      transformDefinition.y =
        svgDimesions.height / 2 - entitiesCenter.y * transformDefinition.k;
    }

    const newTransform = zoomIdentity
      .scale(transformDefinition.k)
      .translate(transformDefinition.x, transformDefinition.y);

    d3Select(svgRef.current)
      .transition()
      .duration(750)
      .call(this.GraphRef.current.zoom.transform, newTransform);
  };

  thereAreEntities(entitiesBox) {
    return entitiesBox.width > 0 && entitiesBox.height > 0;
  }

  getBoxCenter(box) {
    return {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    };
  }

  calcNextK(svgBox, entitiesBox) {
    const { height: svgH, width: svgW } = svgBox;
    const { height: entH, width: entW } = entitiesBox;

    const nextK = 0.95 / Math.max(entW / svgW, entH / svgH);

    if (nextK < config.minZoom) {
      return config.minZoom;
    } else if (nextK > config.maxZoom) {
      return config.maxZoom;
    }
    return nextK;
  }
}

export default App;
