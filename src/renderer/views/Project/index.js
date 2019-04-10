import React, { Component } from "react";
import "./index.less";
import * as EVENTS from "../../../shared/events";
import { withRouter } from "react-router";
import { message, Row, Col } from "antd";

import logo from "@assets/logo.png";
const { ipcRenderer } = window.electron;

class Project extends Component {
  constructor() {
    super();
    this.state = {
      projectInfo: {
        name: "--",
        desc: "****",
        path: "no path",
        servers: [],
        updateTime: "yyyy-mm-dd hh:mm",
        appid: 0
      }
    };
  }

  componentDidMount() {
    if (!this.props.match.params.id) {
      return message.error("无效的appid");
    }
    ipcRenderer.on(EVENTS.GET_PROJECT_BY_ID, (evt, projectInfo) => {
      const data = Object.assign(this.state.projectInfo, projectInfo);
      this.setState({
        projectInfo: data
      });
    });

    // 初次进入页面请求一次
    ipcRenderer.send(EVENTS.GET_PROJECT_BY_ID, this.props.match.params.id);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(EVENTS.GET_PROJECT_BY_ID, () => {});
  }

  render() {
    const {
      name,
      desc,
      path,
      servers,
      updateTime,
      appid
    } = this.state.projectInfo;

    return (
      <div className="project p20">
        <Row type="flex" align="top">
          <Col span={4}>
            <img src={logo} alt="logo" className="project-logo bdr1_ra4" />
          </Col>
          <Col span={10}>
            <p className="t3 w2 c1 mb5 mt10">{name}</p>
            <p className="t4 w3 c3 mb20">{desc}</p>
            <p className="t5 w3 c3">appid: {appid}</p>
          </Col>
          <Col span={10}>
            <p className="mt30 mb10 t5 w2 c2">Last Modify Time: {updateTime}</p>
            <p className="t5 w2 c2">path: {path}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(Project);
