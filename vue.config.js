const { defineConfig } = require('@vue/cli-service')
const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000', // 代理目标的地址
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  chainWebpack(config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config
      .optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        elementUI: {
          name: 'chunk-elementUI', // split elementUI into a single package
          priority: 20,
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/
        },
      }
    }).end()
  },
  configureWebpack: () => {
    if (process.env.NODE_ENV !== 'development') {
      return {
        plugins: [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            generateStatsFile: true,
            statsFilename: 'stats.json',
            openAnalyzer: false
          })
        ]
      }
    }
  }
})
