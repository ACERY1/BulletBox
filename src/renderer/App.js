import React, { Component } from "react";
// import { ipcRenderer } from "electron";
import * as EVENTS from "../shared/events";
import { Button } from "antd";
import "./App.less";

import registerToast from "./common/registerToast";
import Banner from "@components/Banner";

const logoImg = require("@assets/logo.png");
const { ipcRenderer } = window.electron;
class App extends Component {
  boom = () => {
    ipcRenderer.send(EVENTS.FILE_UPLOAD, "upload file");
  };
  componentDidMount() {
    ipcRenderer.on(EVENTS.HELLO_WORLD, (event, arg) => {
      console.log("got from main", arg);
    });
    registerToast();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Banner />
          <h1 className="App-h1">Bullet Box</h1>
          <Button type="primary" onClick={this.boom}>
            Boom!
          </Button>
          <ul>
            <li>CRA Ready</li>
            <li>AntD Support</li>
            <li>Less Support</li>
            <li>Electron Dev Mode</li>
            <li>Electron Build Config</li>
            <li>Hot Reload While Developing Main Process</li>
            <li>Hot Reload While Developing Render Process</li>
          </ul>
        </header>
      </div>
    );
  }
}

export default App;
