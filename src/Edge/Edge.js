import React, { Component } from "react";

class Edge extends Component {
  render() {
    return <path d={this.props.model.pathDefinition} />;
  }
}

export default Edge;
