import nedb from "nedb";
import path from "path";
import fs from "fs";
import { app } from "electron";

const userDataPath = app.getPath("userData");
const dataBasePath = path.resolve(userDataPath, "projects.db");

/**
 * project entity
 * @param {String} name 项目名
 * @param {String} appid 项目id
 * @param {Object} servers 服务器路径键值对 {[env]:[protocol+url+port]}
 * @param {String} path 项目文件路径
 * @param ? 项目icon
 *  */
export class Project {
  constructor(name, appid, servers, path) {
    if (!name || !appid || !servers || !path) {
      throw new Error("constructor project 缺少参数");
    }
    this.name = name;
    this.appid = appid;
    this.servers = servers;
    this.path = path;
  }

  getServerPathByEnv(env) {
    return this.servers[env] ? this.servers[env] : "http://localhost:8080";
  }
}

export class DataBase {
  constructor() {
    this.db = new nedb({ filename: dataBasePath });
    this._init().catch(err => {
      console.log(err);
    });
  }

  /**
   * 初始化或载入DB
   * 返回实例化完成的DB对象
   */
  _init() {
    return new Promise((resolve, reject) => {
      this.db.loadDatabase(err => {
        if (err) reject(err);
        resolve();
      });
    });
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
}
