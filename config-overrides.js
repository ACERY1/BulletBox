/**
 * 自定义配置CRA
 */
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias
} = require("customize-cra");
const path = require("path");
const less_variables = require("./src/renderer/common/styles/variables");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    // modifyVars: { "@primary-color": "#1DA57A" }
    modifyVars: less_variables
  }),
  // for react(render) alias
  addWebpackAlias({
    "@components": path.resolve(__dirname, "./src/renderer/components"), // 组件库
    "@views": path.resolve(__dirname, "./src/renderer/views"), // 页面库
    "@assets": path.resolve(__dirname, "./src/renderer/assets"), // 公用资源
    "@styles": path.resolve(__dirname, "./src/renderer/common/styles"), // 公用样式
    "@scripts": path.resolve(__dirname, "./src/renderer/common/scripts"), // 公用脚本
  })
);
