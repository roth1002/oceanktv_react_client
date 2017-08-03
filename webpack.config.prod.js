var path = require('path');
var webpack = require('webpack');
var poststylus = require('poststylus');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // devtool: 'source-map',
  entry: [
    './app/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.[hash].js',
    publicPath: './'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin("styles.css"),
    new HtmlWebpackPlugin({
      title: 'OceanKTV Console',
      filename: 'index.html',
      template: 'index.template.html',
      favicon: path.join(__dirname, 'app', 'assets', 'images', 'favicon.ico')
    }),
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: path.join(__dirname, 'app')
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract('style', 'css!stylus'),
      exclude: /node_modules/
    }, {
      test: /\.(png|jpg|svg|gif|otf|ttf|woff|eot)$/,
      loaders: ['file'],
      exclude: /node_modules/
    }]
  },
  externals: {
    'jwplayer': 'jwplayer'
  },
  stylus: {
    use: [ poststylus(['postcss-import', 'rucksack-css', 'autoprefixer']) ]
  }
};
