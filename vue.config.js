
const path = require("path");
let webpackConfig;
webpackConfig = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  useEslint: false
};

module.exports = webpackConfig;