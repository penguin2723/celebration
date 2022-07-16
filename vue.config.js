const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  assetsDir: './',
  publicPath: './'
})


// module.exports = {
//   chainWebpack: config => {
//       config.module.rules.delete('eslint');
//   },
//   publicPath: '/three_3d_vue/',
//   outputDir: 'docs'
// }