/**
 * 注册全局弹窗
 */
import * as EVENTS from "../../shared/events";
import { message } from "antd";
const { ipcRenderer } = window.electron;

export default () => {
  // 窗口顶部居中的 Error Toast
  ipcRenderer.on(EVENTS.TOAST_ERROR, (evt, arg) => {
    message.error(arg);
  });

  // Message
  ipcRenderer.on(EVENTS.TOAST_MESSAGE, (evt, arg) => {
    message.info(arg);
  });

  // Warning
  ipcRenderer.on(EVENTS.TOAST_WARNING, (evt, arg) => {
    message.warning(arg);
  });

  // Warning
  ipcRenderer.on(EVENTS.TOAST_SUCCESS, (evt, arg) => {
    message.success(arg);
  });
};
