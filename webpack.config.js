const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './script.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                targets: {
                  browsers: ['since 2013']
                }
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextWebpackPlugin.extract('css-loader?minimize&sourceMap')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      title: 'Tab2QR'
    }),
    new ExtractTextWebpackPlugin({
      filename: 'bundle.css'
    }),
    new CopyWebpackPlugin([
      { from: './manifest.json' },
      { from: './icon*.png' }
    ])
  ],
  node: {
    fs: 'empty'
  }
};
