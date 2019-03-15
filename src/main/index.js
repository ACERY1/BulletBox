// Modules to control application life and create native browser window
import { electron, app, BrowserWindow, Menu } from "electron";
import isElectronDev from 'electron-is-dev';
import path from 'path';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMain = process.env.DEV_ENV === 'devMain';
const isDevRender = process.env.DEV_ENV === 'devRender';

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // 单独开发主进程，加载打包后的h5文件，electron.js在 public 文件目录里
  if (isDevMain) {
    console.log('dev main');
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }
  // 单独开发H5，直接访问localhost
  else if (isDevRender) {
    console.log('dev render');
    mainWindow.loadURL('http://localhost:3000');
  }
  // 同时开发 和 生成模式下
  else {
    console.log('dev both');
    mainWindow.loadURL(isElectronDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './index.html')}`);
  }

  // and load the index.html of the app.
  // mainWindow.loadFile('public/index.html')
  // mainWindow.loadURL(isElectronDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './index.html')}`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

