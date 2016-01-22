var webpack = require('webpack');
var path = require('path');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
  __ENV__           : JSON.stringify('PRODUCTION'),
  __ONE_MONEY_ID__  : JSON.stringify(14),
  __WINNERS_NUM__   : JSON.stringify(50),
  __API__           : JSON.stringify('/api/promotions/one_money'),
  __SIGNUP_URL__    : JSON.stringify('http://m.wanliu.biz/authorize/weixin'),
  __DEFAULT_AVATAR__: JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar'),
};

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    path.resolve(__dirname, 'app/main.js'),
  ],
  output: {
    path: __dirname + '/1111-11-11',
    publicPath: '/',
    filename: './bundle.js',
  },
  module: {
    loaders: [
      {test: /\.css$/, include: path.resolve(__dirname, 'app'), loader: 'style-loader!css-loader'},
      {test: /\.js[x]?$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.styl$/, include: path.resolve(__dirname, 'app'), loaders: ['style', 'css', 'stylus']},
      {test: /\.json$/, include: path.resolve(__dirname, 'app'), loaders: ['json']},
    ]
  },
  plugins: [
    new webpack.DefinePlugin(config),
    new webpack.optimize.DedupePlugin(),
    new UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CopyWebpackPlugin([
      { from: './app/index.html', to: 'index.html' },
    ])
  ]
};
