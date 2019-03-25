const path = require("path");

module.exports = {
  node: {
    __filename: false,
    __dirname: false
  },
  target: "electron-main",
  entry: {
    electron: ["babel-polyfill", "./src/main/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "../public/"),
    filename: "electron.js",
    publicPath: "./",
  },
  resolve: {
    extensions: [".js"],
    // alias for Electron (Main process)
    alias: {
      // '@events': path.resolve(__dirname, '../src/shared/events.js')
    }
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: __dirname + 'node_modules', // 除了指定的内容
        include: __dirname + 'src/main/',  // 匹配指定的文件目录
        // loader: "babel-loader",
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["env", { targets: "node" }]]
            }
          }
        ],
      }
    ]
  }
};
