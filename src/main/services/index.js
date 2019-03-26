/**
 * services 目录用于注册IPCMain事件-功能
 */
import createWinLifeCycle from './createWinLifeCycle';

// 注册各类全生命周期的IPC事件和窗口生命周期
// wins: 伴随app生命周期的窗口集合
export const register = wins => {
  createWinLifeCycle(wins);
}

export const a = 3;