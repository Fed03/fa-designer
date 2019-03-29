import Graph from "./Graph";
import config from "../Config";
import { BottomBar } from "./BottomBar";
import "../styles/App.scss";
import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import { store } from "../Services/Store";
import { select as d3Select } from "d3-selection";
import { ImageSaver } from "../Services/ImageSaver";
import { GraphSerializer } from "../Services/GraphSerializer";
import { FitGraphService } from "../Services/FitGraphService";
import KeyHandler, { KEYDOWN, KEYUP } from "react-key-handler";
import { Drawer } from "./Drawer";
import { Instructions } from "./Instructions";

class App extends Component {
  GraphRef = React.createRef();
  FitService = new FitGraphService(config.minZoom, config.maxZoom);

  constructor(props) {
    super(props);
    this.state = {
      inAnalyzeMode: false
    };
  }

  componentDidMount() {
    setTimeout(() => this.fitEntities(), 1000);
  }

  render() {
    return (
      <Drawer
        isOpen={this.state.inAnalyzeMode}
        width={400}
        drawerContent={this.renderDrawerContent()}
      >
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

        <main>
          <Graph ref={this.GraphRef} />
          <BottomBar
            onFitClick={this.fitEntities}
            onDownloadImgClick={this.downloadGraph}
            onAnalyzeDiagram={this.switchToAnalyzeMode}
          >
            <Instructions />
          </BottomBar>
        </main>
        <ReactTooltip type="dark" effect="solid" place="top" />
      </Drawer>
    );
  }

  renderDrawerContent() {
    return (
      <section>
        <h2>Analyze paths</h2>
      </section>
    );
  }

  switchToAnalyzeMode = () => {
    const { inAnalyzeMode } = this.state;
    this.setState({ inAnalyzeMode: !inAnalyzeMode });
  };

  downloadGraph = () => {
    const { entitiesRef, defRef } = this.GraphRef.current;
    const maxSize = 1920;
    const boxInfos = entitiesRef.current.getBBox();

    let imgW;
    let imgH;
    if (boxInfos.width >= boxInfos.height) {
      imgW = maxSize;
      imgH = (maxSize / boxInfos.width) * boxInfos.height;
    } else {
      imgW = (maxSize / boxInfos.height) * boxInfos.width;
      imgH = maxSize;
    }

    const graph = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    graph.id = config.graphId;
    graph.setAttribute("width", imgW);
    graph.setAttribute("height", imgH);
    graph.appendChild(defRef.current.cloneNode(true));
    const entities = entitiesRef.current.cloneNode(true);
    graph.appendChild(entities);

    const newTransform = new FitGraphService(
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY
    ).fitIntoBox(boxInfos, {
      height: imgH,
      width: imgW
    });
    entities.setAttribute("transform", newTransform);

    const svgString = new GraphSerializer(graph).serialize();
    new ImageSaver(svgString, imgW, imgH).save("FiniteAutomata.png");
  };

  fitEntities = () => {
    const { svgRef, entitiesRef } = this.GraphRef.current;

    const boxInfos = entitiesRef.current.getBBox();
    const svgDimesions = {
      height: svgRef.current.clientHeight,
      width: svgRef.current.clientWidth
    };

    const newTransform = this.FitService.fitIntoBox(boxInfos, svgDimesions);

    d3Select(svgRef.current)
      .transition()
      .duration(500)
      .call(this.GraphRef.current.zoom.transform, newTransform);
  };
}

export default App;
