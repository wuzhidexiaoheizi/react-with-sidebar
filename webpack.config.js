var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = {
  __ENV__           : JSON.stringify('DEV'),
  __ONE_MONEY_ID__  : JSON.stringify(1),
  __WINNERS_NUM__   : JSON.stringify(50),
  __API__           : JSON.stringify('/api/promotions/one_money'),
  __SIGNUP_URL__    : JSON.stringify('http://192.168.0.171:8080/users/sign_in'),
  __DEFAULT_AVATAR__: JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar'),
  __DR_CODE__       : JSON.stringify(true),
  __HOME_IMG__      : JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/bce4aa071456342d64e7a4d5da3cb45d.jpg'),
  __LIST_IMG__      : JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/ac32369464ed4b3017013080d2c6c78b.jpg')
};

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
      {test: /\.css$/, include: path.resolve(__dirname, 'app'), loaders: ['style', 'css', 'postcss']},
      {test: /\.js[x]?$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'babel'},
      {test: /\.styl$/, include: path.resolve(__dirname, 'app'), loaders: ['style', 'css', 'postcss', 'stylus']},
      {test: /\.json$/, include: path.resolve(__dirname, 'app'), loaders: ['json']},
    ]
  },
  postcss: function () {
    return [autoprefixer, precss];
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.html', // Load a custom template
      inject: 'body' // Inject all scripts into the body
    }),
    new webpack.DefinePlugin(config),
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:8080/one_money/index.html' })
  ]
};
