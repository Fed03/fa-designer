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

class App extends Component {
  GraphRef = React.createRef();
  FitService = new FitGraphService(config.minZoom, config.maxZoom);

  componentDidMount() {
    setTimeout(() => this.fitEntities(), 1000);
  }

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
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <h2 className="section-title">How to get started</h2>
                <div className="row">
                  <div className="col">
                    <h3>Creating and connecting States</h3>
                    <p>
                      Let's start with creating our first <strong>State</strong>
                      !<br />
                      <span className="key-indicator">dblClick</span> anywhere
                      on the canvas to create a State.
                    </p>
                    <p>Three things happened:</p>
                    <ol>
                      <li>A state has been created</li>
                      <li>
                        Since it is the first in the graph, it is marked as{" "}
                        <strong>initial</strong>, that is its color is red.
                      </li>
                      <li>
                        A textbox appeared in order to let you type the name of
                        the state
                      </li>
                    </ol>
                    <p>
                      Now, let's create another state by{" "}
                      <span className="key-indicator">dblClick</span> in another
                      position.
                      <br /> Mark it as an acceptance state by{" "}
                      <span className="key-indicator">Alt+click</span>.
                    </p>
                    <p>
                      You surely have noted that when you{" "}
                      <span className="key-indicator">hover</span> on a state, 4
                      smaller circles appear on the cardinal points.
                      <br />
                      These circles are the <strong>Anchor points</strong> and
                      they let you <em>connect</em> 2 states through a
                      transition.
                    </p>
                    <p>
                      Try to <span className="key-indicator">drag</span> one of
                      these anchor points. An arrow appears!
                      <br />
                      Then release the mouse when above the other state: you
                      have succesfuly connected 2 states. In addition, a textbox
                      appeared here too.
                    </p>
                    <p>
                      Last but not least, to create reentrant transition - that
                      is an edge starting and ending to the same state - just{" "}
                      <span className="key-indicator">Alt+click</span> on an
                      Anchor point.
                    </p>
                  </div>
                  <div className="col">
                    <h3>Mooving & Zooming</h3>
                    <p>
                      The editor lets you perform the usual interactions
                      everyone expects from a graphical editor.
                    </p>
                    <ul>
                      <li>
                        Dragging the canvas allows you to move freely around
                      </li>
                      <li>Every state can be moved through dragging too</li>
                    </ul>
                    <p>
                      In addition, holding the{" "}
                      <span className="key-indicator">Alt</span> key and
                      dragging the canvas will create a multi-selection box.
                      States selected together are grouped; this means that
                      moving one state will move the others accordingly.
                    </p>

                    <p>
                      Zoom is present too, and it is enabled through the mouse{" "}
                      <span className="key-indicator">scroll</span>
                    </p>

                    <p>
                      If playing with translations and zooming took you too far
                      from your work, you can simply refocus to the graph using
                      the <strong>fit button</strong> placed just above.
                    </p>
                  </div>
                  <div className="col">
                    <h3>Deleting objects</h3>
                    <p>
                      Selecting single objects is just a{" "}
                      <span className="key-indicator">click</span> away! Or take
                      advantage of the multi-selection box aforementioned.
                      <br />
                      Once selected, any objects can be removed from grpah by
                      pressing the <span className="key-indicator">
                        Del
                      </span>{" "}
                      key.
                    </p>
                    <h3>Editing graph</h3>
                    <p>
                      Every label can be edited through{" "}
                      <span className="key-indicator">dblClick</span> on the
                      corresponding object.
                    </p>
                    <p>
                      If you ever need to specify a different initial state,
                      just <span className="key-indicator">Shift+click</span> on
                      it!
                      <br />
                      If, instead, you want to mark or unmark a state as final
                      you can <span className="key-indicator">
                        Alt+click
                      </span>{" "}
                      on it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BottomBar>
        <ReactTooltip type="dark" effect="solid" place="top" />
      </React.Fragment>
    );
  }

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
