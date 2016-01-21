var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: './app',
    port: 8080,
    proxy: {
      '*': {
        target: 'http://localhost:3000',
        secure: false,
        bypass: function(req, res, proxyOptions) {
          if (req.url.indexOf('/one_money/index.html') > -1) {
            return './index.html';
          }
        },
      }
    }
  },
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    path.resolve(__dirname, 'app/main.js')
  ],
  output: {
    path: __dirname + '/build',
    publicPath: '/one_money',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, include: path.resolve(__dirname, 'app'), loaders: ['style', 'css']},
      {test: /\.js[x]?$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'babel'},
      {test: /\.styl$/, include: path.resolve(__dirname, 'app'), loaders: ['style', 'css', 'stylus']},
      {test: /\.json$/, include: path.resolve(__dirname, 'app'), loaders: ['json']},
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify('DEV')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:8080/one_money/index.html' })
  ]
};
