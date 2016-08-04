
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = {
  __ENV__: JSON.stringify('PRODUCTION'),
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
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')
      },
      {
        test: /\.json$/, include: path.resolve(__dirname, 'app'),
        loaders: ['json']
      },
      {test: /\.png$/, include: path.resolve(__dirname, 'app'), loader: 'url-loader?mimetype=image/png' },
      {test: /\.jpg$/, include: path.resolve(__dirname, 'app'), loader: 'url-loader?mimetype=image/jpg' },
    ]
  },
  postcss: function postcss() {
    return [autoprefixer, precss];
  },
  plugins: [
    new ExtractTextPlugin('[name]_[hash].css'),
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
    new CleanWebpackPlugin(['build', 'release'], {
      verbose: true,
      dry: false
    })
    // new CopyWebpackPlugin([
    //   { from: './app/index.html', to: 'index.html' },
    // ])
  ]
};
