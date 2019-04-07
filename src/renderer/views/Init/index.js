import React, { Component } from "react";
import { Input, Button, message } from "antd";
import "./index.less";

import logo from "@assets/logo.png";
import { generateAppid } from "../../utils/index";
import * as Events from "../../../shared/events";

const { ipcRenderer } = window.electron;

class Init extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appid: "",
      projectName: "",
      projectDescription: "",
      projectPath: "",
      inputLock: false
    };
  }

  /**
   * 选择路径
   */
  selectPath = () => {
    ipcRenderer.send(Events.SELECT_PROJECT_PATH);
  };

  /**
   * 创建项目
   */
  createProject = () => {
    this.lockInput();
    const { appid, projectName, projectDescription, projectPath } = this.state;
    if (!appid || !projectName || !projectDescription || !projectPath) {
      return message.error("新建项目参数缺失");
    }
    ipcRenderer.send(Events.CREATE_PROJECT, {
      name: projectName,
      desc: projectDescription,
      path: projectPath,
      servers: {},
      appid
    });
  };

  unlockInput = () => {
    this.setState({
      inputLock: false
    });
  };

  lockInput = () => {
    this.setState({
      inputLock: true
    });
  };

  componentDidMount() {
    this.setState({
      appid: generateAppid()
    });

    // 选择路径
    ipcRenderer.on(Events.SELECT_PROJECT_PATH, (evt, path) => {
      this.setState({
        projectPath: path
      });
    });

    // 创建项目成功回调
    ipcRenderer.on(Events.CREATE_PROJECT_SUCCESS, () => {
      this.unlockInput();
    });

    // 创建项目失败回调
  }

  componentWillUnmount() {
    // 不销毁可能会造成内存泄漏
    ipcRenderer.removeListener(Events.SELECT_PROJECT_PATH, () => {});
    ipcRenderer.removeListener(Events.CREATE_PROJECT_SUCCESS, () => {});
    ipcRenderer.removeListener(Events.CREATE_PROJECT_FAIL, () => {});
  }

  render() {
    const {
      projectDescription,
      projectName,
      projectPath,
      inputLock
    } = this.state;

    return (
      <div className="init p10">
        <div className="init-intro colBox mt30 pb20">
          <img
            className="init-intro-img bdr1_ra4 sdw_446"
            src={logo}
            alt="logo"
          />
          <p className="t5 w3 c2 mt20">
            Appid: {this.state.appid || "************"}
          </p>
          {projectName ? (
            <p className="t5 w3 c1 mt10">ProjectName: {projectName}</p>
          ) : null}
          {projectDescription ? (
            <p className="t5 w3 c1 mt10">
              ProjectDescription: {projectDescription}
            </p>
          ) : null}
          {projectPath ? (
            <p className="t5 w3 c1 mt10">ProjectPath: {projectPath}</p>
          ) : null}
        </div>
        <div className="colMidBox p10 pt10">
          <p className="t4 c1 w3 mb10 mt20">Project Name:</p>
          <div className="rowBox init-name">
            <Input
              disabled={inputLock}
              placeholder="Project Name"
              value={projectName}
              onChange={val => this.setState({ projectName: val.target.value })}
            />
          </div>
          <p className="t4 c1 w3 mb10 mt20">Project Description:</p>
          <div className="rowBox init-desc">
            <Input
              disabled={inputLock}
              placeholder="Project Description"
              value={projectDescription}
              onChange={val =>
                this.setState({ projectDescription: val.target.value })
              }
            />
          </div>
          <p className="t4 c1 w3 mb10  mt20">Project Path:</p>
          <div className="rowBox init-path">
            {projectPath ? (
              <p>{projectPath}</p>
            ) : (
              <Button size="small" onClick={this.selectPath}>
                Select
              </Button>
            )}
          </div>
          <div className="allMidBox mt30">
            <Button onClick={this.createProject} size="large" type="primary">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Init;
