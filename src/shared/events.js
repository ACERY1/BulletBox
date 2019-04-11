/** 储存 ipcMain 和 ipcRender 相关事件常量。 */
export const HELLO_WORLD = "HELLO_WORLD"; // only for test
export const QUIT_APP = "QUIT_APP"; // 退出app
export const FULL_SCREEN = "FULL_SCREEN"; // 全屏应用
export const MID_SCREEN = "MID_SCREEN"; // 退出全屏
export const MIN_SCREEN = "MIN_SCREEN"; // 最小化应用

// 上传文件相关
export const FILE_UPLOAD = "FILE_UPLOAD";

// 新建项目
export const SELECT_PROJECT_PATH = "SELECT_PROJECT_PATH"; // 选择项目路径
export const CREATE_PROJECT = "CREATE_PROJECT"; // 创建项目
export const CREATE_PROJECT_SUCCESS = "CREATE_PROJECT_SUCCESS"; // 创建项目成功
export const CREATE_PROJECT_FAIL = "CREATE_PROJECT_FAIL"; // 创建项目失败

// 查询项目
export const GET_ALL_PROJECTS = "GET_ALL_PROJECTS";
export const GET_PROJECT_BY_ID = "GET_PROJECT_BY_ID";

// 修改项目
export const MODIFY_PROJECT = "MODIFY_PROJECT";

// 删除项目
export const DELETE_PROJECT = "DELETE_PROJECT";

export const ADD_SERVER_ITEM = "ADD_SERVER_ITEM"; // 在项目里添加服务配置
export const REMOVE_SERVER_ITEM_BY_ENV = "REMOVE_SERVER_ITEM_BY_ENV"; // 通过环境变量移除单个服务配置
export const EDIT_SERVER_ITEM = "EDIT_SERVER_ITEM"; // 编辑服务配置

// 弹框通知
export const TOAST_MESSAGE = "TOAST_MESSAGE"; 
export const TOAST_ERROR = "TOAST_ERROR";
export const TOAST_WARNING = "TOAST_WARNING";
export const TOAST_SUCCESS = "TOAST_SUCCESS";
// export const TOAST_CONFIRM = "TOAST_CONFIRM";
// export const TOAST_CONFIRM_YES = "TOAST_CONFIRM_YES";
// export const TOAST_CONFIRM_NO = "TOAST_CONFIRM_NO";
