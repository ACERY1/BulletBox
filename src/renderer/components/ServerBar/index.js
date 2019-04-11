import React, { Component } from "react";
import { Row, Col, Button, Icon } from "antd";
import "./index.less";

class ServerBar extends Component {

  render() {
    const {
      env = "ERROR",
      url = "http://localhost",
      path = "/web/error",
      status = 1,
      version = "*.*.*",
      updateTime = "YYYY-MM-DD hh:mm"
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
                  <p className="t2 w1 c1 mb5">{env.toUpperCase()}</p>
                  <p className="t3 w2 c1 mb10">{url}</p>
                  <p className="t4 w3 c2">path: {path}</p>
                </div>
              </Col>
              <Col span={10}>
                <p className="t5 w1 c1 mb5">Last Modify Time</p>
                <p className="t5 w2 c2 mb5">{updateTime}</p>
                <p className="t5 w3 c2">version: {version}</p>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row justify="center">
              <Col span={24}>
                <Button type="primary" className="mr10"  icon="link">
                  Link
                </Button>
                <Button type="primary" icon="upload">Deploy</Button>
              </Col>
            </Row>
            <Row className="mt10">
              <Col span={24}>
                <Button type="primary" className="mr10" size="small" icon="edit">
                  Edit
                </Button>
                <Button type="danger" size="small" icon="delete" >
                  Delete
                </Button>
              </Col>
            </Row>
          </Col>
          <Col span={2}>
            <div className="allMidBox">
              {status ? (
                <Icon
                  type="close-circle"
                  theme="filled"
                  className="server-status fail"
                />
              ) : (
                <Icon
                  type="check-circle"
                  theme="filled"
                  className="server-status success"
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ServerBar;
