import Graph from "./Graph";
import config from "../Config";
import "../styles/App.scss";
import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import { select as d3Select } from "d3-selection";
import { ImageSaver } from "../Services/ImageSaver";
import { GraphSerializer } from "../Services/GraphSerializer";
import { FitGraphService } from "../Services/FitGraphService";
import KeyHandler, { KEYDOWN, KEYUP } from "react-key-handler";
import { Drawer } from "./Drawer";
import { Instructions } from "./Instructions";
import { withStore } from "../Services/Store";
import AnalysisPanel from "./Analysis/AnalysisPanel";
import { ActionBar } from "./ActionBar";

class App extends Component {
  GraphRef = React.createRef();
  FitService = new FitGraphService(config.minZoom, config.maxZoom);

  constructor(props) {
    super(props);
    this.state = { showInstructions: false };
  }

  componentDidMount() {
    setTimeout(() => this.fitEntities(), 1000);
  }

  render() {
    const {
      model: { inAnalyzeMode },
      store
    } = this.props;
    const { showInstructions } = this.state;
    return (
      <Drawer
        isOpen={inAnalyzeMode || showInstructions}
        width={400}
        closeDrawer={this.switchToAnalysisMode}
        drawerContent={this.drawerContent}
        onAnimationEnd={this.fitEntities}
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
          <ActionBar
            onFitClick={this.fitEntities}
            onDownloadImgClick={this.downloadGraph}
            onAnalyzeDiagram={this.switchToAnalysisMode}
            onToggleInstructions={this.showInstructions}
          />
          <Graph ref={this.GraphRef} />
          {/* <BottomBar
            onFitClick={this.fitEntities}
            onDownloadImgClick={this.downloadGraph}
            onAnalyzeDiagram={this.switchToAnalysisMode}
          >
            <Instructions />
          </BottomBar> */}
        </main>
        <ReactTooltip type="dark" effect="solid" place="right" />
      </Drawer>
    );
  }

  drawerContent = closeBtn => {
    const { showInstructions } = this.state;
    return showInstructions ? (
      <Instructions />
    ) : (
      <AnalysisPanel closeBtn={closeBtn} />
    );
  };

  showInstructions = () => {
    const { showInstructions } = this.state;
    this.setState({ showInstructions: !showInstructions });
  };

  switchToAnalysisMode = () => {
    this.props.store.toggleAnalysisMode();
    this.setState({ showInstructions: false });
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

export default withStore(App, store => ({
  inAnalyzeMode: store.state.analyzeMode
}));
