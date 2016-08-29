var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'app':'./_build/js/main.js',
    'lazy':'./_build/js/lazy.js',
  },
  output: { path: './assets/js/', filename: '[name].js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};
