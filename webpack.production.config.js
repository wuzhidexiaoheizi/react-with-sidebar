var webpack = require('webpack');
var path = require('path');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
var precss = require('precss');

var config = {
  __ENV__           : JSON.stringify('PRODUCTION'),
  __ONE_MONEY_ID__  : JSON.stringify(22),
  __WINNERS_NUM__   : JSON.stringify(50),
  __API__           : JSON.stringify('/api/promotions/one_money'),
  __SIGNUP_URL__    : JSON.stringify('http://m.wanliu.biz/authorize/weixin'),
  __DEFAULT_AVATAR__: JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar'),
  __DR_CODE__       : JSON.stringify(true),
};

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    path.resolve(__dirname, 'app/main.js'),
  ],
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: './bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/, include: path.resolve(__dirname, 'app'),
        exclude: /node_modules/, loader: 'babel-loader'
      },
      {
        test: /\.styl$/, include: path.resolve(__dirname, 'app'),
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader!stylus-loader")
      },
      {
        test: /\.json$/, include: path.resolve(__dirname, 'app'),
        loaders: ['json']
      },
    ]
  },
  postcss: function () {
    return [autoprefixer, precss];
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
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
