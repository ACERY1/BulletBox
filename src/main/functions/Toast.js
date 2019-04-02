import * as EVENTS from "../../shared/events";

/**
 * 主进程控制弹窗
 */
export default class Toast {
  /**
   * @param {Object} win 窗口实例
   */
  constructor(win) {
    if (
      !(win && win.webContents && typeof win.webContents.send === "function")
    ) {
      throw new Error("【创建主进程弹窗错误】：未传入window实例");
    }
    this.win = win.webContents;
  }

  success(msg) {
    this.win.send(EVENTS.TOAST_SUCCESS, msg);
  }

  info(msg) {
    this.win.send(EVENTS.TOAST_MESSAGE, msg);
  }

  warn(msg) {
    this.win.send(EVENTS.TOAST_WARNING, msg);
  }

  error(msg) {
    this.win.send(EVENTS.TOAST_ERROR, msg);
  }
}
