import nedb from "nedb";
import path from "path";
import fs from "fs";
import moment from "moment";
import { app } from "electron";

const userDataPath = app.getPath("userData");
const dataBasePath = path.resolve(userDataPath, "projects.db");

/**
 * 判断一个对象数组中，某个属性的值是否已经出现过了
 * 没有出现返回0，有返回1, 异常-1
 * @param {Array} ObjectArray 对象数组
 * @param {String} key 欲检查的键名
 * @param {Any} val 欲检查的值（不支持对象）
 */
const _findExistValueForKey = (ObjectArray, key, val) => {
  if (!(ObjectArray instanceof Array)) return -1;
  let flg = 0;
  ObjectArray.forEach(objItem => {
    if (objItem[key] === val) flg = 1;
  });
  return flg;
};

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
      throw new Error("constructor Project 缺少参数");
    }
    this.name = name;
    this.appid = appid;
    this.servers = servers || [];
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

/**
 * Server Entity
 */
export class Server {
  constructor({ env, url, path }) {
    if (!env || !url || !path) {
      throw new Error("constructor Server 缺少参数");
    }
    this.env = env;
    this.url = url;
    this.path = path;
    this.updateTime = moment().format("YYYY-MM-DD hh:mm");
    this.status = 1;
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
        if (project[attr] && attr != "appid") {
          setObj[attr] = project[attr];
        }
      });
      // 更新 修改时间
      setObj.updateTime = moment().format("YYYY-MM-DD hh:mm");
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

  /**
   * 删除项目
   */
  deleteProjectById(appid) {
    return new Promise((resolve, reject) => {
      this.db.remove({ appid: appid }, { multi: false }, function(
        err,
        numRemoved
      ) {
        if (err) reject(err);
        console.log("成功删除" + numRemoved + "个项目");
        resolve();
      });
    });
  }

  /**
   * 根据appid添加服务器配置
   * @param {String} appid
   * @param {Object} serverItem
   * 查询项目，判断env是否重复，不重复则更新
   */
  addServerItemById(appid, serverItem) {
    return new Promise((resolve, reject) => {
      this.getProjectById(appid)
        .then(project => {
          const keyStatus = _findExistValueForKey(
            project.servers,
            "env",
            serverItem.env
          );
          if (keyStatus === 1) {
            reject({
              msg: "env存在"
            });
            return false;
          }
          const servers = project.servers;
          const server = new Server(serverItem);
          servers.push(server);
          this.db.update(
            { appid: appid },
            {
              $set: {
                servers: servers
              }
            },
            {
              multi: false
            },
            err => {
              if (err) reject(err);
              resolve();
            }
          );
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * 根据 appid 和 env 删除某项目的Server配置
   * @param {String} appid
   * @param {String} env
   */
  removeServerItemById(appid, env) {
    return new Promise((resolve, reject) => {
      this.getProjectById(appid)
        .then(project => {
          let index = -1;
          project.servers.forEach((srv, idx) => {
            if (srv.env === env) index = idx;
          });
          project.servers.splice(index, 1);
          this.db.update(
            { appid: appid },
            {
              $set: {
                servers: project.servers
              }
            },
            {
              multi: false
            },
            err => {
              if (err) reject(err);
              resolve(project);
            }
          );
        })
        .catch(err => reject(err));
    });
  }

  /**
   * 根据 appid 和 env 编辑某项目的Server配置
   * @param {String} appid
   * @param {String} env
   * @param {Object} serverItem
   */
  editServerItemById(appid, env, serverItem) {
    return new Promise((resolve, reject) => {
      this.getProjectById(appid)
        .then(project => {
          const servers = project.servers.map(srv => {
            if (srv.env === env) {
              serverItem.updateTime = moment().format("YYYY-MM-DD hh:mm"); //更新编辑时间
              return srv = serverItem;
            };
            return srv;
          });
          console.log(servers)
          project.servers = servers;
          this.db.update(
            { appid: appid },
            {
              $set: {
                servers: servers,
              }
            },
            {
              multi: false
            },
            err => {
              if (err) reject(err);
              resolve(project);
            }
          );
        })
        .catch(err => reject(err));
    });
  }
}

// static attribute   // 除去appid之后的属性
Project.attrs = ["name", "servers", "path", "desc", "updateTime", "status"];
