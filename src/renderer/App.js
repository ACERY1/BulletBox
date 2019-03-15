import React, { Component } from 'react';
import { Button } from 'antd';
import './App.less';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <Button type="primary">Button</Button>
          <h1><span role="img">😂</span></h1>
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
