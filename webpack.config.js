const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')

module.exports = function (config, env) {
    if (env === 'production') {
        config.output.filename = '[name].[chunkhash].js'
        config.output.chunkFilename = '[chunkhash].async.js'
        config.plugins[2] = new ExtractTextPlugin('[name].[contenthash:20].css')
        config.plugins.push(
            new HtmlWebpackPlugin({
                template: 'ejs!src/index.ejs',
                inject: false,
                minify: { collapseWhitespace: true },
                production: true
            }),
            new WebpackMd5Hash()
        )
  } else {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: 'ejs!src/index.ejs',
        inject: true
      }),
    )
  }
  return config
}
