import React from 'react';
import ReactDOM from 'react-dom';
import router from './renderer/router';
import './renderer/preset.css';
// import App from './renderer/App';
import * as serviceWorker from './serviceWorker';

// /src/index.js 文件必须存在，CRA强制规定
ReactDOM.render(router, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
