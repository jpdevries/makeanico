var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    'app':['./_build/js/main.js'],
    'lazy':'./_build/js/lazy.js',
    'common':['./_build/js/helpers.js'],
    'components/swatches':'./_build/js/components/swatches.js',
  },
  output: {
    path: './assets/js/',
    filename: "[name].js"
  },
  plugins: [
   new webpack.optimize.CommonsChunkPlugin({
       names: ["common"],
       minChunks: Infinity
   })
  ],
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
