
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var CleanWebpackPlugin = require('clean-webpack-plugin')
var config = {
  __ONE_MONEY_ID__  : JSON.stringify(28), // 活动ID
  __DR_CODE__       : JSON.stringify(true), // 是否显示二维码
  __HOME_IMG__      : JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/2d7a24f6172fc89513bd49ce2fb6072c.jpg'), // 首页图片
  __LIST_IMG__      : JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/96b33c5747e2cf405278d18331fc032b.jpg'),  // 列表图片
  __DEFAULT_AVATAR__: JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar'),
  __SIGNUP_URL__    : JSON.stringify('http://m.wanliu.biz/authorize/weixin'),
  __API__           : JSON.stringify('/api/promotions/one_money'),
  __ENV__           : JSON.stringify('PRODUCTION'),
  __WINNERS_NUM__   : JSON.stringify(50),
};

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    path.resolve(__dirname, 'app/main.js'),
  ],
  output: {
    path: __dirname + '/build',
    publicPath: './',
    filename: 'bundle_[hash].js',
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
    new ExtractTextPlugin("[name]_[hash].css"),
    new webpack.DefinePlugin(config),
    new webpack.optimize.DedupePlugin(),
    new UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: './app/index.html', // Load a custom template
      inject: 'body' // Inject all scripts into the body
    }),
    new CleanWebpackPlugin(['build'], {
      verbose: true,
      dry: false
    })
    // new CopyWebpackPlugin([
    //   { from: './app/index.html', to: 'index.html' },
    // ])
  ]
};
