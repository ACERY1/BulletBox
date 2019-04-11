import React, { Component } from "react";
import "./index.less";
import * as EVENTS from "../../../shared/events";
import { withRouter } from "react-router";
import { message, Row, Col, Button } from "antd";

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

  removeProject = () => {
    ipcRenderer.send(EVENTS.DELETE_PROJECT, this.state.projectInfo.appid);

  }

  componentDidMount() {
    if (!this.props.match.params.id) {
      return message.error("无效的appid");
    }

    // 获取项目
    ipcRenderer.on(EVENTS.GET_PROJECT_BY_ID, (evt, projectInfo) => {
      const data = Object.assign(this.state.projectInfo, projectInfo);
      this.setState({
        projectInfo: data
      });
    });

    // 删除项目
    ipcRenderer.on(EVENTS.DELETE_PROJECT, () => {
      ipcRenderer.send(EVENTS.GET_ALL_PROJECTS);
      this.props.history.push('/home');
    })

    // 初次进入页面请求一次
    ipcRenderer.send(EVENTS.GET_PROJECT_BY_ID, this.props.match.params.id);
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(EVENTS.GET_PROJECT_BY_ID);
    ipcRenderer.removeAllListeners(EVENTS.DELETE_PROJECT);
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
            <p className="t5 w2 c2 mb10">path: {path}</p>
            <Button
              type="primary"
              shape="circle"
              icon="edit"
              size="small"
              onClick={() => {
                this.props.history.push({ pathname: "/init", search: `?edit=true&appid=${appid}` });
              }}
            />
            <Button
            type="primary"
            shape="circle"
            icon="delete"
            size="small"
            className="remove-btn ml20"
            onClick={this.removeProject}
          />
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(Project);
