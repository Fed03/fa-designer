const config = {
  nodeRadius: 50,
  edge: {
    strokeWidth: 5,
    creationId: "creation-edge"
  },
  markerSize: 4,
  dropShadowId: "drop-shadow-filter",
  store: {
    key: "store_state",
    saveFreq: 2000
  },
  minZoom: 0.5,
  maxZoom: 2,
  graphId: "graph-root"
};

Object.freeze(config);

export default config;
