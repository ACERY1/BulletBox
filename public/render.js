/* 在 React 里注入 Electron */
// const process = require('process');

// process.once('loaded', () => {
//   console.log('注入')
  global.electron = require('electron')
// });