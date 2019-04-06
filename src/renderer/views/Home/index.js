import React, { Component } from "react";
import { Button } from "antd";
import {withRouter} from 'react-router';
import "./index.less";

import logo from "@assets/logo.png";

class Home extends Component {

  // 跳转至新建项目
  goInitProject = () => {
    this.props.history.push('init')
  }

  render() {
    return (
      <div className="home p10 pt60">
        <div className="allMidBox mt30 pb20">
          <img src={logo} alt="logo" />
          <p className="t1 w2 c1">Bullet Box Client</p>
          <p className="t5 w3 c2 mt5">Transform Code Easily</p>
          <Button
            className="mt50"
            type="primary"
            icon="plus-square"
            size="large"
            onClick={this.goInitProject}
          >
            New Project
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Home); // get 'history' in this.props
