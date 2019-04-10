import nedb from "nedb";
import path from "path";
import fs from "fs";
import moment from "moment";
import { app } from "electron";

const userDataPath = app.getPath("userData");
const dataBasePath = path.resolve(userDataPath, "projects.db");

/**
 * project entity
 * @param {String} name 项目名
 * @param {String} appid 项目id
 * @param {Object} servers 服务器路径键值对 {[env]:[protocol+url+port]}
 * @param {String} path 项目文件路径
 * @param {String} desc 项目描述
 * @param {Number} status 项目状态 1异常
 * @param ? 项目icon
 *  */
export class Project {
  constructor(name, desc, path, appid, servers) {
    if (!name || !appid || !path || !desc) {
      throw new Error("constructor project 缺少参数");
    }
    this.name = name;
    this.appid = appid;
    this.servers = servers || {};
    this.path = path;
    this.desc = desc;
    // update create time 该参数内置 不用传
    this.updateTime = moment().format("YYYY-MM-DD hh:mm");
    this.status = 0;
  }

  getServerPathByEnv(env) {
    return this.servers[env] ? this.servers[env] : "http://localhost:8080";
  }

  // 更新修改项目配置时间
  updateModifyTime() {
    this.updateTime = moment().format("YYYY-MM-DD hh:mm");
  }
}

export class DataBase {
  constructor() {
    this.db = new nedb({ filename: dataBasePath });
    this._init();
  }

  /**
   * 初始化或载入DB
   * 返回实例化完成的DB对象
   */
  _init() {
    this.db.loadDatabase(err => {
      if (err) throw new Error(err);
    });
    this.db.ensureIndex({ fieldName: "appid", unique: true });
  }

  /**
   * 本地读取所有项目数据
   * @returns {Promise} Array
   */
  getAllProjects() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, projects) => {
        if (err) reject(err);
        resolve(projects);
      });
    });
  }

  /**
   * 新建project
   * @param {Project} project 项目实体
   */
  insertProject(project) {
    return new Promise((resolve, reject) => {
      this.db.insert(project, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  /**
   * 通过appid, 修改项目信息
   * 修改项目信息, 支持部分修改
   * @param {appid} 查询用appid
   * @param {Project} project
   */
  modifyProject(appid, project) {
    return new Promise((resolve, reject) => {
      if (!appid || typeof appid != "string")
        reject("修改项目失败：未传入appid");
      const setObj = {};
      // 支持部分更新属性
      Project.attrs.forEach(attr => {
        if (project[attr]&& attr!='appid') {
          setObj[attr] = project[attr];
        }
      });
      this.db.update(
        {
          appid: project.appid // 根据appid查询
        },
        {
          $set: setObj
        },
        {
          multi: false
        },
        err => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  /**
   * 根据appid获取项目信息
   * @param {String} appid
   */
  getProjectById(appid) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ appid: appid }, (err, project) => {
        if (err) reject(err);
        resolve(project);
      });
    });
  }
}

// static attribute   // 除去appid之后的属性
Project.attrs = ["name", "servers", "path", "desc", "updateTime", "status"];
