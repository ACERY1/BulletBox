// 主进程提供的服务，它的下层是functions
import { ipcMain } from "electron";
import createMainWindow from "../windows/createMainWindow";
import * as EVENTS from "../../shared/events";
import { read } from "../functions/files";
import { writeProject, initProjectsDB } from "../functions/projects";

export default wins => {
  // 创建窗口
  createMainWindow(wins);

  // TEST事件
  ipcMain.on(EVENTS.HELLO_WORLD, (event, arg) => {
    console.log("Main got message", arg);
    event.sender.send(EVENTS.HELLO_WORLD, "main process message");
  });

  ipcMain.on(EVENTS.FILE_UPLOAD, (event, arg) => {
    // read();
    // writeProject();
    initProjectsDB();
  });

  
};
