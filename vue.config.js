//vue.config.js
const path = require('path')
const isDevelopment = process.env.NODE_ENV == 'development'
const UniappJSDispatchPlugin = require('./split-chunks');
const MpImportRuntimeTemplatePlugin = require('./import-runtime');
module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "~@/uni.scss";
        `
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    output: {
      pathinfo: false,
    },
  },
  transpileDependencies: ['uni-simple-router'],
  configureWebpack: (webpackConfig) => {
    // webpackConfig.plugins.push(new UniappJSDispatchPlugin())
    if (process.env.UNI_PLATFORM !== "h5") {
      webpackConfig.optimization.splitChunks = require("./split-chunks")();
      webpackConfig.plugins.push(new MpImportRuntimeTemplatePlugin());
    }
    // webpackConfig.optimization.minimize = false;
  },
}
