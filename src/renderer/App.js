import React, { Component } from "react";
import { Button, Layout } from "antd";

import "@styles/common.less";
import "./App.less";

import * as EVENTS from "../shared/events";
import registerToast from "@scripts/registerToast";
import ProjectListItem from "@components/ProjectListItem";

const { ipcRenderer } = window.electron;
const { Sider, Content } = Layout;

class App extends Component {
  constructor() {
    super();
    this.state = {
      list: [1, 2, 3, 4]
    };
  }
  boom = () => {
    ipcRenderer.send(EVENTS.FILE_UPLOAD, "upload file");
  };
  componentDidMount() {
    ipcRenderer.on(EVENTS.HELLO_WORLD, (event, arg) => {
      console.log("got from main", arg);
    });
    registerToast(); // 注册Toast IPC
  }

  // 断点回调fn
  breakCB = (point)=> {
    console.log(point);
  }

  render() {
    return (
      <div className="app">
        <Layout>
          <Sider 
          className="app-slider"
          collapsible={true}
          onBreakpoint={this.breakCB}
          width="300"
          theme="light"
          >
            {this.state.list.map((item, key) => (<ProjectListItem key={key}></ProjectListItem>))}
          </Sider>
          <Layout>
            <Content className="app-content">Content</Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
