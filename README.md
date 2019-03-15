### 注意

* 开发时用的 /public/electron.js，打包的时候是 /public/electron.js
* 打包应用程序的时候别开VPN，可能会报错。


### 要点

* 改变main里和shared里的代码只重新加载窗口
* 改变renderer里的代码更新窗口里面的页面