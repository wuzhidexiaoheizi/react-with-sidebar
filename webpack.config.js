var webpack = require('webpack');
var path = require('path');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = {
  __ENV__                 : JSON.stringify('DEV'),
  __QR_CODE__             : JSON.stringify(process.env.QRCODE || true), // 是否显示二维码
  __HOME_IMG__            : JSON.stringify(process.env.HOMEIMG || 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/2d7a24f6172fc89513bd49ce2fb6072c.jpg'), // 首页图片
  __LIST_IMG__            : JSON.stringify(process.env.LISTIMG || 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/poster/102/96b33c5747e2cf405278d18331fc032b.jpg'),  // 列表图片
  __DEFAULT_AVATAR__      : JSON.stringify(process.env.DEFAULTAVATAR || 'http://wanliu-piano.b0.upaiyun.com/uploads/shop/logo/1/default_avatar.gif!avatar'),
  __SIGNUP_URL__          : JSON.stringify(process.env.SIGNURL || 'http://0.0.0.0:8080/users/sign_in'),
  __TIMESTAMP__           : JSON.stringify(process.env.TICK || new Date().getTime())
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
        target: 'http://192.168.0.161:3000',
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
    'webpack-dev-server/client?http://0.0.0.0:8080',
    path.resolve(__dirname, 'app/main.js')
  ],
  output: {
    path: __dirname + '/build',
    publicPath: '/one_money',
    filename: './bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.styl']
  },
  module: {
    loaders: [
      {test: /\.css$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loaders: ['style', 'css', 'postcss']},
      {test: /\.js[x]?$/, include: path.resolve(__dirname, 'app'), exclude: /node_modules/, loader: 'babel'},
      {test: /\.styl$/, include: path.resolve(__dirname, 'app'), loaders: ['style', 'css', 'postcss', 'stylus']},
      {test: /\.json$/, include: path.resolve(__dirname, 'app'), loaders: ['json']},
      {test: /\.png$/, include: path.resolve(__dirname, 'app'), loader: 'url-loader?mimetype=image/png' },
      {test: /\.jpg$/, include: path.resolve(__dirname, 'app'), loader: 'url-loader?mimetype=image/jpg' },
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
    new OpenBrowserPlugin({ url: 'http://0.0.0.0:8080/one_money/index.html' })
  ]
};
