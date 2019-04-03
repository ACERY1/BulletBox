import React, { Component } from 'react';
import { Button } from "antd";
import Banner from "@components/Banner";
import './index.less';

const { ipcRenderer } = window.electron;
const logoImg = require("@assets/logo.png");


class Intro extends Component {
  render() {
    return (
      <div className="intro">
      <header className="intro-header">
      <Banner />
      <h1 className="intro-h1">Bullet Box</h1>
      <h2 className="intro-h2">Transform Your Code Easily</h2>
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

export default Intro;
