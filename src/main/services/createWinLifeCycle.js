// 主进程提供的服务，它的下层是functions
import createMainWindow from '../windows/createMainWindow';

export default wins => {
  createMainWindow(wins);
}