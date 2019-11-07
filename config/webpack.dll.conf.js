const path = require('path');
const webpack = require('webpack');

/* eslint-disable no-undef */
module.exports = {
  entry: {
    vendor: ['moment', 'react', 'react-dom', 'babel-polyfill', 'dva', 'react-dom/server']
  },
  output: {
    path: path.resolve(__dirname, '../libs'),
    filename: '[name].dll.js',
    library: '[name]'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]',
      context: path.resolve(__dirname, '../')
    })
  ]
};
