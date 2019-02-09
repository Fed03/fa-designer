// @ts-nocheck
import { NodeData } from "../Node/Models/NodeData";
import { Node } from "../Node/Models/Node";
import { EdgeData } from "../Edge/Models/EdgeData";
import uuid from "uuid/v1";

class Store {
  nodes = [];
  edges = [];

  loadPayload(jsonObj) {
    jsonObj.nodes.forEach(({ id, label, isInitial, isFinal, metadata }) => {
      this.nodes.push(new NodeData(id, label, isInitial, isFinal, metadata));
    });

    jsonObj.edges.forEach(({ srcNodeId, trgNodeId, metadata }) => {
      this.edges.push(new EdgeData(srcNodeId, trgNodeId, metadata));
    });
  }

  createNode([x, y]) {
    this.deselectAllNodes();

    const data = new NodeData(uuid(), "", false, false);
    const node = new Node(data, x, y);
    node.selected = true;

    this.nodes.push(node);

    return node;
  }

  removeNode(node) {
    this.nodes.splice(this.nodes.findIndex(n => n.id === node.id), 1);
  }

  deselectAllNodes() {
    this.nodes.forEach(node => (node.selected = false));
  }
}

const store = new Store();
Object.freeze(store);

export { store };
