// 主进程提供的服务，它的下层是functions
import { ipcMain} from "electron";
import createMainWindow from "../windows/createMainWindow";
import * as EVENTS from "../../shared/events";
import Toast from "../functions/Toast";

import {Project, DataBase } from "../functions/projects";

export default wins => {
  // 创建窗口
  const mainWin = createMainWindow(wins);

  const toast = new Toast(mainWin);

  // TEST事件
  ipcMain.on(EVENTS.HELLO_WORLD, (event, arg) => {
    console.log("Main got message", arg);
    event.sender.send(EVENTS.HELLO_WORLD, "main process message");
  });

  ipcMain.on(EVENTS.FILE_UPLOAD, async (event, arg) => {
    // let p = new Project('hello', '#3333', {}, '/srv');

    
    // read();
    // writeProject();
    // try {
    //   const DB = new DataBase();
    //   await DB.insertProject(p); // 插入
    //   const projects  = await DB.getAllProjects();
    //   console.log(projects);
    // } catch(err) {
    //   console.log(err)
    // }

    // mainWin.webContents.send(EVENTS.TOAST_MESSAGE, 'd?')

    toast.success('成功！');
    toast.info('信息');
    toast.error('出错');
    toast.warn('警告')
  });

  
};
