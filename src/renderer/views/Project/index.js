import React, { Component } from "react";
import "./index.less";
import * as EVENTS from "../../../shared/events";
import { withRouter } from "react-router";
import {
  message,
  Row,
  Col,
  Button,
  Icon,
  Modal,
  Input,
  Tag,
  Tooltip
} from "antd";
import ServerBar from "@components/ServerBar";
import TagInput from "@components/TagInput";

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
        servers: [1],
        updateTime: "yyyy-mm-dd hh:mm",
        appid: 0
      },
      modalVisible: false,
      isEditServer: false,
      serverItem: {
        path: "",
        url: "",
        env: "",
        suffix: [],
        entry: ''
      }
    };
  }

  removeProject = () => {
    ipcRenderer.send(EVENTS.DELETE_PROJECT, this.state.projectInfo.appid);
  };

  /** 添加服务配置、编辑服务配置 */
  addServer = () => {
    const { env, path, url } = this.state.serverItem;
    if (!env || !path || !url) {
      return message.error("参数不能为空");
    }
    if (this.state.isEditServer) {
      ipcRenderer.send(EVENTS.EDIT_SERVER_ITEM, {
        appid: this.state.projectInfo.appid,
        env: this.state.serverItem.env,
        serverItem: this.state.serverItem
      });
    } else {
      ipcRenderer.send(EVENTS.ADD_SERVER_ITEM, {
        appid: this.state.projectInfo.appid,
        serverItem: this.state.serverItem
      });
    }
  };

  openModal = env => {
    if (env.mode === "edit") {
      let serverItem = {};
      serverItem.path = env.path;
      serverItem.url = env.url;
      serverItem.env = env.env;
      serverItem.suffix = env.suffix;
      serverItem.status = env.status;
      serverItem.entry = env.entry;
      this.setState({
        modalVisible: true,
        isEditServer: true, // 服务器配置编辑模式
        serverItem: serverItem
      });
    } else {
      this.setState({
        modalVisible: true
      });
    }
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
      isEditServer: false,
      serverItem: {
        path: "",
        env: "",
        url: "",
        suffix: [],
        entry: '',
      }
    });
  };

  handleSuffix = suffix => {
    const serverItem = Object.assign({}, this.state.serverItem, { suffix });
    this.setState({
      serverItem
    });
  };
  inputHandler = (valName, evt) => {
    let val = evt.target.value;
    let data = Object.assign({}, this.state.serverItem, {
      [valName]: val
    });
    this.setState({
      serverItem: data
    });
  };

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
      this.props.history.push("/home");
    });

    // 添加服务器配置
    // 注意：编辑服务器配置的ipc也关联了该监听器
    ipcRenderer.on(EVENTS.ADD_SERVER_ITEM, () => {
      ipcRenderer.send(EVENTS.GET_PROJECT_BY_ID, this.props.match.params.id);
      this.closeModal();
      this.setState({
        serverItem: {
          path: "",
          env: "",
          url: "",
          suffix: [],
          entry: '',
        }
      });
    });

    ipcRenderer.on(EVENTS.EDIT_SERVER_ITEM, () => {
      this.closeModal();
    });

    // 初次进入页面请求一次
    ipcRenderer.send(EVENTS.GET_PROJECT_BY_ID, this.props.match.params.id);
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(EVENTS.GET_PROJECT_BY_ID);
    ipcRenderer.removeAllListeners(EVENTS.DELETE_PROJECT);
    ipcRenderer.removeAllListeners(EVENTS.ADD_SERVER_ITEM);
    ipcRenderer.removeAllListeners(EVENTS.EDIT_SERVER_ITEM);
  }

  // 当路由只更新路由参数的时候需要更新同一页面的数据
  componentWillReceiveProps(nextProps) {
    ipcRenderer.send(EVENTS.GET_PROJECT_BY_ID, nextProps.match.params.id);
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

    const serverItem = this.state.serverItem;

    const { modalVisible, isEditServer } = this.state;

    const isServersArray = Array.isArray(servers);

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
                this.props.history.push({
                  pathname: "/init",
                  search: `?edit=true&appid=${appid}`
                });
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
        {isServersArray &&
          servers.map((item, index) => (
            <ServerBar
              key={index}
              {...item}
              appid={appid}
              projectPath={path}
              editFn={this.openModal.bind(this, {
                mode: "edit",
                ...item
              })}
            />
          ))}
        <div className="allMidBox mt20">
          <Icon
            type="plus-circle"
            theme="filled"
            className="add-btn"
            onClick={this.openModal}
          />

          <p className="t5 w3 c2 mt5">Add Server Config</p>
        </div>

        <Modal
          title={isEditServer ? "Edit Your Service" : "Add Your Service"}
          visible={modalVisible}
          onOk={this.addServer}
          onCancel={this.closeModal}
        >
          <div className="mb10">
            <Input
              prefix={<Icon type="gold" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="text"
              disabled={isEditServer}
              value={serverItem.env}
              onChange={this.inputHandler.bind(this, "env")}
              placeholder="Custom Environment, example: 'local'"
            />
          </div>
          <div className="mb10">
            <Input
              prefix={
                <Icon type="desktop" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              type="text"
              value={serverItem.url}
              placeholder="Service URL, example: 'http://localhost:7001'"
              className="mt10"
              onChange={this.inputHandler.bind(this, "url")}
            />
          </div>
          <div className="mb10">
            <Input
              prefix={<Icon type="file" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="text"
              value={serverItem.path}
              placeholder="Service Path, example: '/web/srv'"
              className="mt10"
              onChange={this.inputHandler.bind(this, "path")}
            />
          </div>
          <div className="mb10">
          <Input
            prefix={<Icon type="file" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="text"
            value={serverItem.entry}
            placeholder="Project Entry, example: 'index.html'"
            className="mt10"
            onChange={this.inputHandler.bind(this, "entry")}
          />
        </div>
          <div className="mt10">
            <p className="mb5 t5 c2 w4">suffix examples: '.html', '.js', '.css'</p>
            <TagInput suffix={serverItem.suffix} dataCB={this.handleSuffix} />
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Project);
