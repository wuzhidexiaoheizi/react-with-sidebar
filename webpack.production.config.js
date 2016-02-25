
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
  __ENV__           : JSON.stringify('PRODUCTION'),
  __ONE_MONEY_ID__  : JSON.stringify(25),
  __WINNERS_NUM__   : JSON.stringify(50),
  __API__           : JSON.stringify('/api/promotions/one_money'),
  __SIGNUP_URL__    : JSON.stringify('http://m.wanliu.biz/authorize/weixin'),
  __DEFAULT_AVATAR__: JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar'),
  __DR_CODE__       : JSON.stringify(true),
  __HOME_IMG__      : JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/bce4aa071456342d64e7a4d5da3cb45d.jpg'),
  __LIST_IMG__      : JSON.stringify('http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/ac32369464ed4b3017013080d2c6c78b.jpg')
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
