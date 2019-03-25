const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
  // for react(render) alias
  addWebpackAlias({
    '@components': path.resolve(__dirname, './src/renderer/components'),
    '@assets': path.resolve(__dirname, './src/renderer/assets')
  })
);