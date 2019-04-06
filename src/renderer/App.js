import React, { Component } from "react";
import { Button, Layout } from "antd";

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";

import "@styles/common.less";
import "./App.less";

import * as EVENTS from "../shared/events";
import registerToast from "@scripts/registerToast";
import ProjectListItem from "@components/ProjectListItem";

import Init from "@views/Init";
import Project from "@views/Project";

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
    const { history } = this.props;
    history.push("init");
    ipcRenderer.on(EVENTS.HELLO_WORLD, (event, arg) => {
      console.log("got from main", arg);
    });
    registerToast(); // 注册Toast IPC
  }

  // 断点回调fn
  breakCB = point => {
    console.log(point);
  };

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
            {this.state.list.map((item, key) => (
              <ProjectListItem key={key} />
            ))}
          </Sider>

          <Layout>
            <Content className="app-content">
              <Router>
                <Route path="/init" exact component={Init} />
                <Route path="/project" exact component={Project} />
              </Router>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default withRouter(App);
