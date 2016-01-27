var path = require('path');
var webpack = require('webpack');
var strip = require('strip-loader');
var isomorphic = require('./isomorphic').plugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var $q = require('webpack-querify');
var $j = path.join;
var context = path.resolve(__dirname, '..', '..');

module.exports = {
  devtool: 'source-map',
  context: context,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [strip.loader('debug'), 'babel']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(css|scss)/,
        exclude: $j('client', 'src', 'app', 'views'),
        loader: ExtractTextPlugin.extract(
          'style',
          $q({
            'css': {
              sourceMap: true,
              importLoaders: 1
            },
            'sass': {
              sourceMap: true,
              outputStyle: 'expanded'
            },
            autoprefixer: {
              browsers: 'last 2 versions,ie <= 8'
            }
          })
        )
      },
      {
        test: /\.(css|scss)/,
        include: $j('client', 'src', 'app', 'views'),
        loader: ExtractTextPlugin.extract(
          'style',
          $q({
            'css': {
              modules: true,
              importLoaders: 2,
              sourceMap: true
            },
            'sass': {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: true
            },
            autoprefixer: {
              browsers: 'last 2 versions,ie <= 8'
            }
          })
        )
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        query: {
          limit: 10240
        }
      }
    ],
    postLoaders: [{
      test: /\.js$/,
      loaders: ['es3ify']
    }]
  },
  plugins: [
    new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
        HOST: JSON.stringify(process.env.HOST),
        GA_TRACKING_ID: JSON.stringify(process.env.GA_TRACKING_ID),
        PORT: process.env.PORT
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: false,
      minimize: false
    }),
    isomorphic
  ]
};