import path from 'path';

export default {
  webPreferences: {
    javascript: true,
    plugins: true,
    webSecurity: false,
    // file path based on /public
    preload: path.join(__dirname, './render.js')
  },
  width: 800,
  height: 600
};
