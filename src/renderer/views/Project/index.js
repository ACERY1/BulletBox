import React, { Component } from "react";
import "./index.less";
import * as EVENTS from "../../../shared/events";
import { withRouter } from "react-router";
import { message } from "antd";

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
      const data = Object.assign(this.state.projectInfo, projectInfo)
      this.setState({
        projectInfo: data
      });
    });

    // 初次进入页面请求一次
    ipcRenderer.send(EVENTS.GET_PROJECT_BY_ID, this.props.match.params.id);
  }
  

  componentWillUnmount() {
    ipcRenderer.removeListener(EVENTS.GET_PROJECT_BY_ID, () => {})
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
      <div className="project">
        {name}
        {desc}
      </div>
    );
  }
}

export default withRouter(Project);
