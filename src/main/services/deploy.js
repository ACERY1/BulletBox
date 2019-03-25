/**
 * 上传部署相关的service
 * service包含 render 和 main 的 IPC
 */
import { ipcMain } from "electron";
import * as events from '../../shared/events';

export default () => {
  ipcMain.on(events.HELLO_WORLD, (event, arg) => {
    console.log('Main got message', arg);
    event.sender.send(events.HELLO_WORLD, 'main process message')
  })
}