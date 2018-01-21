'use strict';

/**
* Module dependencies.
*/
var path = require('path');
var webpack = require('webpack');

// webpack-dev-server port
var PORT = 3000;

/**
* Webpack development configuration.
*/
module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:' + PORT, // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    path.join(__dirname, '/app/js/client.js') // app entry point
  ],

  output: {
    path: path.join(__dirname, '/app/build/'),
    filename: '[name].js',
    publicPath: 'http://localhost:' + PORT + '/app/build'
  },

  target: 'electron'
  ,

  devServer: {
    quiet: true, // don't output anything to the console
    inline: true, // embed the webpack-dev-server runtime into the bundle
    port: PORT
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-decorators-legacy' ],
          presets: ['es2015', 'stage-0', 'react']
        }
      },

      {
        test: /\.json$/,
        loader: 'json-loader',
        query: {
          cacheDirectory: false
        }
      }
    ]
  },
  externals: [
    'child_process'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx','.json']
  },

  devtool: 'eval-source-map'
};
