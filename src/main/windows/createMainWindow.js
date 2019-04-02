// 创建main窗口
import path from "path";
import { BrowserWindow } from "electron";

// env 判断
import isElectronDev from "electron-is-dev";
const isDevMain = process.env.DEV_ENV === "devMain";
const isDevRender = process.env.DEV_ENV === "devRender";

const config = {
  webPreferences: {
    javascript: true,
    plugins: true,
    webSecurity: false,
    // file path based on /public
    preload: path.join(__dirname, "./render.js")
  },
  width: 1080,
  height: 960
};

export default wins => {
  let mainWin = new BrowserWindow(config);

  // 单独开发主进程，加载打包后的h5文件，electron.js在 public 文件目录里
  if (isDevMain) {
    console.log("dev main");
    mainWin.loadFile(path.join(__dirname, "../build/index.html"));
    mainWin.webContents.openDevTools();
  }
  // 单独开发H5，直接访问localhost
  else if (isDevRender) {
    console.log("dev render");
    mainWin.loadURL("http://localhost:3000");
    mainWin.webContents.openDevTools();
  }
  // 同时开发 和 生成模式下
  else {
    console.log("dev both or production");
    if (isElectronDev) {
      mainWin.webContents.openDevTools();
    }

    //__dirname is /public
    mainWin.loadURL(
      isElectronDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "./index.html")}`
    );

    wins.main = mainWin;

    return mainWin;
  }
};
