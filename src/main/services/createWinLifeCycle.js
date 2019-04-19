// 主进程提供的服务，它的下层是functions
import { ipcMain } from "electron";
import createMainWindow from "../windows/createMainWindow";
import * as EVENTS from "../../shared/events";
import Toast from "../functions/Toast";
import urlUtil from "url";

import { Project, DataBase } from "../functions/projects";
import { selectPath, getFilesArray, uploadFiles } from "../functions/files";

export default wins => {
  // 创建窗口
  const mainWin = createMainWindow(wins);

  // 实例化toast弹窗 供main进程使用
  const toast = new Toast(mainWin);

  // DatBase connection
  try {
    var DB = new DataBase();
  } catch (err) {
    console.log("数据库连接失败", err);
    toast.error("数据库连接失败");
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
    const { name, desc, appid, path, servers } = projectInfo;
    const p = new Project(name, desc, path, appid, servers);

    try {
      await DB.insertProject(p);
      evt.sender.send(EVENTS.CREATE_PROJECT_SUCCESS);
      toast.success("新建项目成功！");

      // FIXME: debug用查看所有项目
      // const projects = await DB.getAllProjects();
      // console.log(projects);
    } catch (err) {
      console.log("新建项目失败", err);
      toast.error("新建项目失败");
      evt.sender.send(EVENTS.CREATE_PROJECT_FAIL);
    }
  });

  // 查询所有项目
  ipcMain.on(EVENTS.GET_ALL_PROJECTS, async evt => {
    const projects = await DB.getAllProjects();
    evt.sender.send(EVENTS.GET_ALL_PROJECTS, projects);
  });

  // 查询单个项目
  ipcMain.on(EVENTS.GET_PROJECT_BY_ID, async (evt, appid) => {
    const projectInfo = await DB.getProjectById(appid);
    // console.log(projectInfo);
    evt.sender.send(EVENTS.GET_PROJECT_BY_ID, projectInfo);
  });

  // 编辑项目基本信息
  ipcMain.on(EVENTS.MODIFY_PROJECT, async (evt, projectInfo) => {
    try {
      await DB.modifyProject(projectInfo.appid, projectInfo);
      toast.success("编辑项目成功");
      // success signal
      evt.sender.send(EVENTS.MODIFY_PROJECT);
    } catch (err) {
      console.log(err);
      toast.error("编辑项目失败");
    }
  });

  ipcMain.on(EVENTS.DELETE_PROJECT, async (evt, appid) => {
    try {
      await DB.deleteProjectById(appid);
      toast.success("删除项目成功");
      evt.sender.send(EVENTS.DELETE_PROJECT);
    } catch (err) {
      console.log(err);
      toast.error("删除项目失败");
    }
  });

  ipcMain.on(EVENTS.ADD_SERVER_ITEM, async (evt, { serverItem, appid }) => {
    try {
      await DB.addServerItemById(appid, serverItem);
      toast.success("添加服务器配置成功");
      evt.sender.send(EVENTS.ADD_SERVER_ITEM);
    } catch (error) {
      console.log(error);
      if (error.msg) {
        toast.error(error.msg);
      } else {
        toast.error("添加服务器配置失败");
      }
    }
  });

  ipcMain.on(EVENTS.REMOVE_SERVER_ITEM_BY_ENV, async (evt, { appid, env }) => {
    try {
      const project = await DB.removeServerItemById(appid, env);
      toast.success("删除服务端配置成功");
      // mainWin.webContents.send(EVENTS.GET_PROJECT_BY_ID, project)
      evt.sender.send(EVENTS.ADD_SERVER_ITEM);
    } catch (error) {
      console.log(error);
      toast("删除服务器配置失败");
    }
  });

  ipcMain.on(
    EVENTS.EDIT_SERVER_ITEM,
    async (evt, { appid, env, serverItem }) => {
      try {
        const project = await DB.editServerItemById(appid, env, serverItem);
        toast.success("编辑成功");
        mainWin.webContents.send(EVENTS.GET_PROJECT_BY_ID, project);
        evt.sender.send(EVENTS.EDIT_SERVER_ITEM);
      } catch (error) {
        console.log(error);
        toast("编辑服务器配置失败");
      }
    }
  );

  ipcMain.on(
    EVENTS.CHANGE_SERVER_STATUS,
    async (evt, { appid, env, status }) => {
      try {
        const project = await DB.changeServerStatusById(appid, env, status);
        mainWin.webContents.send(EVENTS.GET_PROJECT_BY_ID, project);
        const projects = await DB.getAllProjects();
        mainWin.webContents.send(EVENTS.GET_ALL_PROJECTS, projects);
      } catch (err) {
        console.log(err);
        toast("更改服务器状态失败");
      }
    }
  );

  ipcMain.on(EVENTS.FILE_UPLOAD, async (event, args) => {
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

    // toast.success("成功！");
    // toast.info("信息");
    // toast.error("出错");
    // toast.warn("警告");
    const { url, path, projectPath, suffix, appid, env, status } = args;
    try {
      if (status === 1) {
        return toast.warn("请先测试连接是否成功: click 'link' button");
      } else {
        const filesArray = await getFilesArray(projectPath, suffix);
        console.log(filesArray);
        uploadFiles(
          urlUtil.resolve(url, `/project/update?path=${encodeURI(path)}`),
          filesArray,
          {
            // deployPath: path, // FIXME:数据 服务端接收不到
          }, // postData
          {}, // http opt
          projectPath
        );
        toast.success("上传成功！");
        await DB.updateModifyTimeById$Env(appid, env);
        const project = await DB.changeServerStatusById(appid, env, 0); // 成功
        mainWin.webContents.send(EVENTS.GET_PROJECT_BY_ID, project);
      }
    } catch (error) {
      console.log(error);
    }
  });
};
