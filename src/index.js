import "./index.css";
import React from "react";
import config from "./Config";
import ReactDOM from "react-dom";
import App from "./Components/App";
import localforage from "localforage";
import { store } from "./Services/Store";
import "bootstrap/dist/css/bootstrap-reboot.css";
import "bootstrap/dist/css/bootstrap-grid.css";

async function restoreData() {
  const result = await localforage.getItem(config.store.key);
  if (result) {
    store.loadPayload(result);
  }
}

function saveData() {
  setInterval(() => {
    const { edges, nodes } = store.state;
    localforage.setItem(config.store.key, { edges, nodes });
  }, config.store.saveFreq);
}

restoreData().then(() => {
  ReactDOM.render(<App />, document.getElementById("root"));
  saveData();
});
