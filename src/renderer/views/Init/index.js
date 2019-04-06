import React, { Component } from "react";
import { Input, Button } from "antd";
import "./index.less";

import logo from "@assets/logo.png";
import { generateAppid } from "../../utils/index";

class Init extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appid: null
    };
  }

  componentDidMount() {
    this.setState({
      appid: generateAppid()
    });
  }

  render() {
    return (
      <div className="init p10 pt50">
        <div className="init-intro allMidBox mt30 pb20">
          <img src={logo} alt="logo" />
          <p className="t5 w3 c2 mt20">
            Appid: {this.state.appid || "************"}
          </p>
        </div>
        <div className="colMidBox p10 pt10">
          <p className="t4 c1 w3 mb10 mt20">Project Name:</p>
          <div className="rowBox init-name">
            <Input placeholder="Project Name" />
          </div>
          <p className="t4 c1 w3 mb10 mt20">Project Description:</p>
          <div className="rowBox init-desc">
            <Input placeholder="Project Description" />
          </div>
          <p className="t4 c1 w3 mb10  mt20">Project Path:</p>
          <div className="rowBox init-path">
            <Input placeholder="Select Project Path" disabled={true}/>
          </div>
          <div className="allMidBox mt30">
            <Button size="large" type="primary">Confirm</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Init;
