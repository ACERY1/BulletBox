import React, { Component } from "react";
import PropTypes from "prop-types";
import {Icon} from 'antd';
import {withRouter} from 'react-router';
import "./index.less";

import * as Events from "../../../shared/events";

const { ipcRenderer } = window.electron;

class ProjectListItem extends Component {

  goProject = () => {
    const {history} = this.props
    const appid = this.props.project.appid
    // if(history.location.pathname.indexOf('project') === -1) {
      history.push(`/project/${appid}`)
    // } else {
      // 非第一次进入页面请求刷新数据
      // ipcRenderer.send(Events.GET_PROJECT_BY_ID, appid)
    // }
  }

  render() {
    const {
      name = "bulletbox",
      desc = "transform your code easily",
      updateTime = "ERROR TIME RECORDING",
      status,
      appid = 0,
      path = "/pathError"
    } = this.props.project;

    return (
      <div className="PItem bdr1_ra4 m10 p20" onClick = {this.goProject}>
        <div className="rowBox info">
          <div className="PItem-name t3 w2 c1">{name}</div>
          {
            status ?  <Icon type="close-circle" theme="filled" className="PItem-status fail" /> :  <Icon type="check-circle" theme="filled" className="PItem-status success"/>
          }
        </div>
        <p className="t5 w3 c2 mb10">{desc}</p>
        <div className="PItem-appid t5 w3 c3">{path}</div>
        <div className="PItem-time t5 w3 c3">{updateTime}</div>
      </div>
    );
  }
}

ProjectListItem.propTypes = {
  project: PropTypes.object
};

export default withRouter(ProjectListItem);
