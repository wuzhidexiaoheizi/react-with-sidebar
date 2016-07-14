const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  __ENV__: JSON.stringify('DEV'),
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
        bypass: function bypass(req) {
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
  postcss: function postcss() {
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
