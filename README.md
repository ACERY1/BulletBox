### 注意

* 开发时用的 /public/electron.js，打包的时候是 /public/electron.js
* 打包应用程序的时候最好科学上网开全局，因为打包会下载一些打包必要文件。


### 要点

* 改变main里和shared里的代码只重新加载窗口
* 改变renderer里的代码更新窗口里面的页面


### npm 命令释义

* web-dev: 浏览器打开，开发h5
* electron-web-dev: electron打开，开发h5
* electron-main-dev: electron打开，开发主进程
* main-build：打包主进程文件
* main-build-run：打包主进程文件并直接运行（采用打包后的h5）
* electron-dev：electron打开，同时开发h5和主进程
* build：h5打包
* electron-pack：构建安装包（需要分平台构建）
* clear: 删除历史构建包
* refresh: 重装依赖


TODO:
1. 获取所选路径 [done]
2. 新建项目 [done]
3. 项目鉴重
4. 获取项目信息 [done]
5. 获取所有项目[done]
6. 编辑项目信息 [done]
7. 编辑服务端配置  [done]
8. 版本号设计