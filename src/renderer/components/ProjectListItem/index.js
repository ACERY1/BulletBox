import React, { Component } from "react";
import PropTypes from "prop-types";
import "./index.less";

class ProjectListItem extends Component {
  render() {
    const {
      name = "bulletbox",
      desc = "transform your code easily",
      updateTime = "ERROR TIME RECORDING",
      status = 0,
      appid = 0,
      path = "/pathError"
    } = this.props.project;
    return (
      <div className="PItem bdr1_ra4 m10 p20">
        <div className="rowBox info">
          <div className="PItem-name t3 w2 c1">{name}</div>
          <div className="PItem-time">{status}</div>
        </div>
        <div className="PItem-status t5 w3 c2">{updateTime}</div>
      </div>
    );
  }
}

ProjectListItem.propTypes = {
  project: PropTypes.object
};

export default ProjectListItem;
