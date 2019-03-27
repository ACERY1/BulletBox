import { electron, app, BrowserWindow, Menu } from "electron";
import isElectronDev from 'electron-is-dev';
import path from 'path';

const isDevMain = process.env.DEV_ENV === 'devMain';
const isDevRender = process.env.DEV_ENV === 'devRender';

const windowConfig = {
  width: 800,
  height: 600,
  webPreferences: {
    preload: path.join(__dirname, './render.js') // 目录是 Electron.js 所在目录
  },

};

export default (wins) => {
  let mainWindow = new BrowserWindow(windowConfig);

  // 单独开发主进程，加载打包后的h5文件，electron.js在 public 文件目录里
  if (isDevMain) {
    console.log('dev main');
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }
  // 单独开发H5，直接访问localhost
  else if (isDevRender) {
    console.log('dev render');
    mainWindow.webContents.openDevTools()
    mainWindow.loadURL('http://localhost:3000');
  }
  // 同时开发 和 生成模式下
  else {
    console.log('dev both');
    if (isElectronDev) {
      mainWindow.webContents.openDevTools();
      mainWindow.loadURL('http://localhost:3000');
    } else {
      mainWindow.loadURL(`file://${path.join(__dirname, './index.html')}`);
    }
  }

  wins.main = mainWindow;

  mainWindow.on('close', function () {
    wins.main = null;
  })
}