
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
  __QR_CODE__             : JSON.stringify(process.env.QRCODE || true), // 是否显示二维码
  __HOME_IMG__            : JSON.stringify(process.env.HOMEIMG || 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/2d7a24f6172fc89513bd49ce2fb6072c.jpg'), // 首页图片
  __LIST_IMG__            : JSON.stringify(process.env.LISTIMG || 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/96b33c5747e2cf405278d18331fc032b.jpg'),  // 列表图片
  __DEFAULT_AVATAR__      : JSON.stringify(process.env.DEFAULTAVATAR || 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar'),
  __SIGNUP_URL__          : JSON.stringify(process.env.SIGNURL || 'http://m.wanliu.biz/authorize/weixin'),
  __ENV__                 : JSON.stringify('PRODUCTION'),
  __TIMESTAMP__           : JSON.stringify(process.env.TICK || new Date().getTime())
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
      {test: /\.png$/, include: path.resolve(__dirname, 'app'), loader: 'url-loader?mimetype=image/png' },
      {test: /\.jpg$/, include: path.resolve(__dirname, 'app'), loader: 'url-loader?mimetype=image/jpg' },
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
