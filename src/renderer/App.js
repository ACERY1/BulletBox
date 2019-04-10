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
      projectList: []
    };
  }

  // 初始化项目
  goToInitProject = () => {
    this.props.history.push('/init');
  };

  componentDidMount() {
    this.props.history.push("/home");

    ipcRenderer.on(EVENTS.GET_ALL_PROJECTS, (event, projects) => {
      console.log(projects);
      this.setState({
        projectList: projects || []
      });
    });

    ipcRenderer.send(EVENTS.GET_ALL_PROJECTS);

    registerToast(); // 注册Toast IPC
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(EVENTS.GET_ALL_PROJECTS);
  }

  render() {
    const { projectList } = this.state;
    const hasProjects = projectList.length;
    return (
      <div className="app">
        <Layout>
          <Sider
            className="app-slider"
            collapsible={true}
            width="300"
            theme="light"
          >
            {hasProjects ? (
              this.state.projectList.map((item, key) => (
                <ProjectListItem key={key} project={item} />
              ))
            ) : (
              <p className="t4 w4 c3 t_center p10 bdr1_ra4">
                You Have No Project
              </p>
            )}
          </Sider>

          <Layout>
            <Content className="app-content">
              <Router>
                <Route path="/init" exact component={Init} />
                <Route path="/project/:id" exact component={Project} />
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
