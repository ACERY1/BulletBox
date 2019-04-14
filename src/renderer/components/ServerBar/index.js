import React, { Component } from "react";
import { Row, Col, Button, Icon, message, Tag } from "antd";
import "./index.less";
import * as EVENTS from "../../../shared/events";
import http from "axios";
const { ipcRenderer } = window.electron;
const colors = ["magenta", "red", "volcano", "orange", "gold", "green", "cyan"];
class ServerBar extends Component {
  remove = () => {
    ipcRenderer.send(EVENTS.REMOVE_SERVER_ITEM_BY_ENV, {
      appid: this.props.appid,
      env: this.props.env
    });
  };

  link = () => {
    const { url, path, appid, env } = this.props;
    http
      .get(`${url}/link`, {
        params: {
          appid,
          path
        }
      })
      .then(res => {
        const { message: msg } = res.data;
        // secret
        if (msg === "AABBBBAA") {
          message.success("连接成功");
          ipcRenderer.send(EVENTS.CHANGE_SERVER_STATUS, {
            appid,
            env,
            status: 0
          });
        } else {
          ipcRenderer.send(EVENTS.CHANGE_SERVER_STATUS, {
            appid,
            env,
            status: 1
          });
        }
      })
      .catch(err => {
        message.error("连接失败，请检查URL");
        ipcRenderer.send(EVENTS.CHANGE_SERVER_STATUS, {
          appid,
          env,
          status: 1
        });
      });
  };

  render() {
    const {
      env = "ERROR",
      url = "http://localhost",
      path = "/web/error",
      status = 1,
      version = "*.*.*",
      updateTime = "YYYY-MM-DD hh:mm",
      appid,
      suffix = [".js", ".css", ".html"] // * means all files
    } = this.props;

    return (
      <div className="server p20 m15 mt20 sdw_446">
        <Row
          className="server-box "
          type="flex"
          justify="center"
          align="middle"
        >
          <Col span={16}>
            <Row>
              <Col span={14}>
                <div className="colBox">
                  <p className="t1 w1 c1 mb5">{env}</p>
                  <p className="t3 w2 c1 mb10">{url}</p>
                  <p className="t4 w3 c2">path: {path}</p>
                </div>
              </Col>
              <Col span={10}>
                <p className="t5 w1 c1 mb5">Last Modify Time</p>
                <p className="t5 w2 c2 mb5">{updateTime}</p>
                <p className="t5 w3 c2 mb10">version: {version}</p>
                {suffix.map((i, idex) => (
                  <Tag color={colors[idex % colors.length]} key={idex}>
                    {i}
                  </Tag>
                ))}
                {suffix.length === 0 ? (
                  <p className="t5 w2 c2 mb5">All Files</p>
                ) : null}
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row justify="center">
              <Col span={24}>
                <Button
                  type="primary"
                  className="mr10"
                  icon="link"
                  onClick={this.link}
                >
                  Link
                </Button>
                <Button type="primary" icon="upload">
                  Deploy
                </Button>
              </Col>
            </Row>
            <Row className="mt10">
              <Col span={24}>
                <Button
                  type="primary"
                  className="mr10"
                  size="small"
                  icon="edit"
                  onClick={this.props.editFn}
                >
                  Edit
                </Button>
                <Button
                  type="danger"
                  size="small"
                  icon="delete"
                  onClick={this.remove}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={2}>
            <div className="allMidBox">
              {status ? (
                <div>
                  <Icon
                    type="close-circle"
                    theme="filled"
                    className="server-status fail"
                  />
                  <p className="t5 c1 w2 mt10 t_center">Fail</p>
                </div>
              ) : (
                <div>
                  <Icon
                    type="check-circle"
                    theme="filled"
                    className="server-status success"
                  />
                  <p className="t5 c1 w2 mt10 t_center">Success</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ServerBar;
