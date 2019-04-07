// 主进程提供的服务，它的下层是functions
import { ipcMain } from "electron";
import createMainWindow from "../windows/createMainWindow";
import * as EVENTS from "../../shared/events";
import Toast from "../functions/Toast";

import { Project, DataBase } from "../functions/projects";
import { selectPath } from "../functions/files";

export default wins => {
  // 创建窗口
  const mainWin = createMainWindow(wins);

  // 实例化toast弹窗 供main进程使用
  const toast = new Toast(mainWin);

  // DatBase connection
  try {
    var DB = new DataBase();
  } catch (err) {
    toast.error(err);
  }

  // TEST事件
  ipcMain.on(EVENTS.HELLO_WORLD, (event, arg) => {
    console.log("Main got message", arg);
    event.sender.send(EVENTS.HELLO_WORLD, "main process message");
  });

  // 新建项目选择路径事件
  ipcMain.on(EVENTS.SELECT_PROJECT_PATH, async (evt, arg) => {
    const pathString = await selectPath();
    evt.sender.send(EVENTS.SELECT_PROJECT_PATH, pathString);
  });

  // 创建项目
  ipcMain.on(EVENTS.CREATE_PROJECT, async (evt, projectInfo) => {
    console.log('get!')
    const { name, desc, appid, path, servers } = projectInfo;
    const p = new Project(name, desc, path, appid, servers);

    try {
      await DB.insertProject(p);
      evt.sender.send(EVENTS.CREATE_PROJECT_SUCCESS);
      toast.success("新建项目成功！");
      const projects  = await DB.getAllProjects();
      console.log(projects);
    } catch (err) {
      toast.error(err);
      evt.sender.send(EVENTS.CREATE_PROJECT_FAIL);
    }
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

    toast.success("成功！");
    toast.info("信息");
    toast.error("出错");
    toast.warn("警告");
  });
};
