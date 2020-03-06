module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {},
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}
// 线上环境
// module.exports = {
//   env: {
//     NODE_ENV: 'online' // 申请的微信小程序云开发资源id
//   },
//   defineConstants: {
//   },
//   weapp: {},
//   h5: {}
// }
