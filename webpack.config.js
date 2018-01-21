'use strict';

/**
 * Module dependencies.
 */
var path = require('path');

/**
 * Export webpack config.
 */
module.exports = {
    entry: path.join(__dirname, '/app/js/client.js'),

    output: {
        path: path.join(__dirname, '/app/build/'),
        filename: '[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    plugins: ['transform-decorators-legacy' ],
                    presets: ['es2015', 'stage-0','react', 'env']
                }
            },
            {
              test: /\.json$/,
              loader: 'json-loader'
            }
        ]
    },
    externals: [
      'child_process'
    ],
    target: 'electron'
    ,
    resolve: {
        extensions: ['', '.js', '.jsx','.json']
    }
};
