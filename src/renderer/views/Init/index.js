import React, { Component } from "react";
import { Input, Button } from "antd";
import "./index.less";

import logo from "@assets/logo.png";
import { generateAppid } from "../../utils/index";
import * as Events from '../../../shared/events';

const { ipcRenderer } = window.electron;

class Init extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appid: "",
      projectName: "",
      projectDescription: "",
      projectPath: ""
    };
  }

  /**
   * @param {String}
   * @returns {String} path 文件夹路径
   */
  selectPath = () => {
    ipcRenderer.send(Events.SELECT_PROJECT_PATH)
  }

  componentDidMount() {
    this.setState({
      appid: generateAppid()
    });

    ipcRenderer.on(Events.SELECT_PROJECT_PATH, (evt, path) => {
      this.setState({
        projectPath: path,
      }
      );
    })
  }

  render() {
    const { projectDescription, projectName, projectPath } = this.state;

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
              placeholder="Project Name"
              value={projectName}
              onChange={val => this.setState({ projectName: val.target.value })}
            />
          </div>
          <p className="t4 c1 w3 mb10 mt20">Project Description:</p>
          <div className="rowBox init-desc">
            <Input
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
              <Button size="small" onClick={this.selectPath}>Select</Button>
            )}
          </div>
          <div className="allMidBox mt30">
            <Button size="large" type="primary">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Init;
