import { ipcMain } from 'electron';
import * as EVENTS from '../../shared/events';
import createMain from '../windows/createMain';
import sayHello from '../functions/sayHello';

// 在这里注册ipc事件
export default wins => {
  createMain(wins);

  ipcMain.on(EVENTS.HELLO_WORLD, (evt, arg) => {
    sayHello();
    console.log(arg);
  })
}