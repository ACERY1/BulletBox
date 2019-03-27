import windowLifeCycle from './windowLifeCycle';

// 注册各窗口实例&ipc事件
export const register = wins => {
  windowLifeCycle(wins);
}