import { PathsList } from "./PathsList";
import "../../styles/AnalysisPanel.scss";
import React, { Component } from "react";
import { SelectInput } from "../SelectInput";
import { withStore } from "../../Services/Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { Transition } from "react-spring/renderprops";

class AnalysisPanel extends Component {
  render() {
    const { nodes, nodeSelectedForAnalysis } = this.props.model;
    const selectableNodes = nodes.filter(n => !n.isInitial);
    return (
      <section className="analysis-panel">
        <h2 className="analysis-title">Analyze paths {this.props.closeBtn}</h2>
        <div className="analysis-content">
          <div className="card">
            <h3 className="card-title">Find paths leading to</h3>
            <div className="inline card-content">
              <SelectInput
                defaultOption="Chose node..."
                selectedValue={nodeSelectedForAnalysis}
                data={selectableNodes}
                onChange={this.handleSelectChange}
                valueSelector={node => node.id}
                labelSelector={node => node.data.label}
              />
              <span data-tip="Run analysis" onClick={this.startAnalysis}>
                <FontAwesomeIcon
                  icon={faPlayCircle}
                  size="3x"
                  fixedWidth
                  className="btn-icon"
                />
              </span>
            </div>
          </div>
          <Transition
            items={this.renderPathsFound()}
            from={{ transform: "translateX(-50vw)" }}
            enter={{ transform: "translateX(0)" }}
            leave={{ transform: "translateX(-50vw)" }}
          >
            {el => el && (style => <div style={style}>{el}</div>)}
          </Transition>
          {}
        </div>
      </section>
    );
  }

  renderPathsFound() {
    const {
      store,
      model: { analysisPaths, nodeSelectedForAnalysis }
    } = this.props;

    if (analysisPaths) {
      return (
        <section className="card">
          <h3 className="card-title">
            Paths leading to node {nodeSelectedForAnalysis.data.label}
          </h3>
          <PathsList
            paths={analysisPaths}
            onPathSelection={store.setSelectedPath.bind(store)}
            onPathBlur={store.removeSelectedPath.bind(store)}
          />
        </section>
      );
    }
  }

  startAnalysis = () => {
    this.props.store.runAnalysis();
  };

  handleSelectChange = selectedNode => {
    this.props.store.setNodeSelectedForAnalysis(selectedNode);
  };
}

export default withStore(AnalysisPanel, store => ({
  nodes: store.state.nodes,
  nodeSelectedForAnalysis: store.state.nodeSelectedForAnalysis,
  analysisPaths: store.state.pathsFound
}));
