import React, { Component } from "react";
import PropTypes from "prop-types";
import "./index.less";

class ProjectListItem extends Component {
  render() {
    const {
      name = "bulletbox",
      time = "2019年04月04日11:32:26",
      status = 0
    } = this.props;
    return (
      <div className="PItem bdr1_ra4 m10 p20">
        <div className="rowBox info">
          <div className="PItem-name t3 w2 c1">{name}</div>
          <div className="PItem-time">{status}</div>
        </div>
        <div className="PItem-status t5 w3 c2">{time}</div>
      </div>
    );
  }
}

ProjectListItem.propTypes = {
  name: PropTypes.string, // 项目名
  time: PropTypes.string, // 时间
  status: PropTypes.number // 1 means error
};

export default ProjectListItem;
