import React, { Component } from 'react';
import { Button } from 'antd';
import './App.less';
import Banner from '@components/Banner';

const logoImg = require('@assets/logo.png');

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Banner/>
          <h1 className="App-h1">Bullet Box</h1>
          <Button type="primary">Boom!</Button>
          <ul>
            <li>CRA Ready</li>
            <li>AntD Support</li>
            <li>Less Support</li>
            <li>Electron Dev Mode</li>
            <li>Electron Build Config</li>
            <li>Hot Reload While Developing Main Process</li>
            <li>Hot Reload While Developing Render Process</li>
          </ul>
        </header>
      </div>
    );
  }
}

export default App;
