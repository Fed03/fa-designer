import Graph from "./Graph";
import { BottomBar } from "./BottomBar";
import React, { Component } from "react";
import KeyHandler, { KEYDOWN, KEYUP } from "react-key-handler";
import { store } from "../Services/Store";
import config from "../Config";
import { zoomIdentity } from "d3-zoom";
import { select as d3Select } from "d3-selection";
import { GraphSerializer } from "../Services/GraphSerializer";
import { ImageSaver } from "../Services/ImageSaver";

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
        <BottomBar
          onFitClick={this.fitEntities}
          onDownloadImgClick={this.downloadGraph}
        >
          <h3>How to use</h3>
        </BottomBar>
      </React.Fragment>
    );
  }

  downloadGraph = () => {
    const { entitiesRef, defRef } = this.GraphRef.current;
    const maxSize = 1920;
    const boxInfos = entitiesRef.current.getBBox();
    if (this.thereAreEntities(boxInfos)) {
      let imgW;
      let imgH;
      if (boxInfos.width >= boxInfos.height) {
        imgW = maxSize;
        imgH = (maxSize / boxInfos.width) * boxInfos.height;
      } else {
        imgW = (maxSize / boxInfos.height) * boxInfos.width;
        imgH = maxSize;
      }

      const graph = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      graph.id = "graph-root";
      graph.setAttribute("width", imgW);
      graph.setAttribute("height", imgH);
      graph.appendChild(defRef.current.cloneNode(true));
      const entities = entitiesRef.current.cloneNode(true);
      graph.appendChild(entities);

      const transformDefinition = this.fitIntoBox(entities.getBBox(), {
        height: imgH,
        width: imgW
      });
      const newTransform = zoomIdentity
        .scale(transformDefinition.k)
        .translate(transformDefinition.x, transformDefinition.y);
      entities.setAttribute("transform", newTransform);

      const svgString = new GraphSerializer(graph).serialize();
      new ImageSaver(svgString, imgW, imgH).save("dummy1.png");
    }
  };

  fitEntities = () => {
    const { svgRef, entitiesRef } = this.GraphRef.current;

    let newTransform = zoomIdentity;
    const boxInfos = entitiesRef.current.getBBox();
    if (this.thereAreEntities(boxInfos)) {
      const svgDimesions = {
        height: svgRef.current.clientHeight,
        width: svgRef.current.clientWidth
      };

      const transformDefinition = this.fitIntoBox(boxInfos, svgDimesions);
      newTransform = zoomIdentity
        .translate(transformDefinition.x, transformDefinition.y)
        .scale(transformDefinition.k);
    }
    d3Select(svgRef.current)
      .transition()
      .duration(750)
      .call(this.GraphRef.current.zoom.transform, newTransform);
  };

  fitIntoBox(whatToFit, box) {
    const transformDefinition = {
      x: 0,
      y: 0,
      k: 1
    };

    transformDefinition.k = this.calcNextK(box, whatToFit);

    const whatToFitCenter = this.getBoxCenter(whatToFit);
    const boxCenter = this.getBoxCenter(box);

    transformDefinition.x =
      boxCenter.x - whatToFitCenter.x * transformDefinition.k;

    transformDefinition.y =
      boxCenter.y - whatToFitCenter.y * transformDefinition.k;

    return transformDefinition;
  }

  thereAreEntities(entitiesBox) {
    return entitiesBox.width > 0 && entitiesBox.height > 0;
  }

  getBoxCenter(box) {
    return {
      x: (box.x || 0) + box.width / 2,
      y: (box.y || 0) + box.height / 2
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
