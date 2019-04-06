import React, { Component } from "react";
import { Button, Layout } from "antd";
import { HashRouter as Router, Route } from "react-router-dom";
import { withRouter } from "react-router";

import "@styles/common.less";
import "./App.less";

// functions
import * as EVENTS from "../shared/events";
import registerToast from "@scripts/registerToast";

// components
import ProjectListItem from "@components/ProjectListItem";

// pages
import Init from "@views/Init";
import Project from "@views/Project";
import Home from "@views/Home";

const { ipcRenderer } = window.electron;
const { Sider, Content } = Layout;

class App extends Component {
  constructor() {
    super();
    this.state = {
      list: [1, 2, 3, 4]
    };
  }

  // 初始化项目
  goToInitProject = () => {
    this.props.history.push("/init");
  };

  componentDidMount() {
    this.props.history.push("home");
    ipcRenderer.on(EVENTS.HELLO_WORLD, (event, arg) => {
      console.log("got from main", arg);
    });
    registerToast(); // 注册Toast IPC
  }

  render() {
    return (
      <div className="app">
        <Layout>
          <Sider
            className="app-slider"
            collapsible={true}
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
                <Route path="/home" exact component={Home} />
              </Router>
              <div className="app-content-init" onClick={this.goToInitProject}>
                <Button
                  type="primary"
                  shape="circle"
                  icon="plus-circle"
                  size="large"
                />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default withRouter(App);
