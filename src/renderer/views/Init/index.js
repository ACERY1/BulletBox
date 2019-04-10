import React, { Component } from "react";
import { Input, Button, message } from "antd";
import "./index.less";
import { withRouter } from "react-router";

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
      inputLock: false,
      isEditMode: false // 是否是编辑项目信息
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

  /**
   * 编辑项目
   */
  editProject = () => {
    const { appid, projectName, projectDescription, projectPath } = this.state;
    if (!appid || !projectName || !projectDescription || !projectPath) {
      return message.error("新建项目参数缺失");
    }
    ipcRenderer.send(Events.MODIFY_PROJECT, {
      name: projectName,
      desc: projectDescription,
      path: projectPath,
      appid
    })

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
    const params = new URLSearchParams(this.props.location.search);
    if (params.get("edit") && params.get("appid")) {
      console.log("项目编辑模式");
      this.setState({
        isEditMode: !!params.get("edit")
      });
      ipcRenderer.on(Events.GET_PROJECT_BY_ID, (evt, projectInfo) => {
        this.setState({
          projectName: projectInfo.name,
          projectDescription: projectInfo.desc,
          projectPath: projectInfo.path,
          appid: params.get("appid")
        });
      });

      ipcRenderer.on(Events.MODIFY_PROJECT, evt => {
        // 编辑成功
        ipcRenderer.send(Events.GET_ALL_PROJECTS);
        this.props.history.goBack();
      })
      // 编辑模式通过id请求数据
      ipcRenderer.send(Events.GET_PROJECT_BY_ID, params.get("appid"));
    } else {
      this.setState({
        appid: generateAppid()
      });
    }

    // 选择路径
    ipcRenderer.on(Events.SELECT_PROJECT_PATH, (evt, path) => {
      this.setState({
        projectPath: path
      });
    });

    // 创建项目成功回调
    ipcRenderer.on(Events.CREATE_PROJECT_SUCCESS, () => {
      this.unlockInput();
      ipcRenderer.send(Events.GET_ALL_PROJECTS); // 更新项目列表
    });

    // 创建项目失败回调
    // main进程已通知弹窗，这里可以做一些逻辑操作
    ipcRenderer.on(Events.CREATE_PROJECT_FAIL, () => {
      this.unlockInput();
    });
    
  }

  componentWillUnmount() {
    // 不销毁可能会造成内存泄漏
    ipcRenderer.removeAllListeners(Events.GET_PROJECT_BY_ID);
    ipcRenderer.removeAllListeners(Events.MODIFY_PROJECT);
    ipcRenderer.removeAllListeners(Events.SELECT_PROJECT_PATH);
    ipcRenderer.removeAllListeners(Events.CREATE_PROJECT_SUCCESS);
    ipcRenderer.removeAllListeners(Events.CREATE_PROJECT_FAIL);
  }

  render() {
    const {
      projectDescription,
      projectName,
      projectPath,
      inputLock,
      isEditMode
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
            {isEditMode ? (
              <Button size="small" onClick={this.selectPath}>
                Select
              </Button>
            ) : null}
          </div>
          <div className="allMidBox mt30">
            {isEditMode ? (
              <Button onClick={this.editProject} size="large" type="primary">
                Confirm Edit
              </Button>
            ) : (
              <Button onClick={this.createProject} size="large" type="primary">
                Confirm
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Init);
