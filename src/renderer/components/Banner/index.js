import React, { Component } from 'react';
import './index.less';

const logoImg = require('@assets/logo.png');


class Banner extends Component {
  render() {
    return (
      <div className="Banner">
      <img src={logoImg} alt="" />
      </div>
    );
  }
}

export default Banner;
