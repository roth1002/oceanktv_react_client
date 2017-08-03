var path = require('path');
var webpack = require('webpack');
var poststylus = require('poststylus');
var argv = require('minimist')(process.argv.slice(2))

const INPUT_HOST = argv['host'] || argv['h'] || 'http://192.168.0.220'
const API_HOST = INPUT_HOST.search(/^http[s]?\:\/\//) == -1 ? `http://${INPUT_HOST}` : INPUT_HOST
const API_PORT = argv['port'] || argv['p'] || '5603'

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'API_HOST': JSON.stringify(API_HOST),
        'API_PORT': JSON.stringify(API_PORT)
      }
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: path.join(__dirname, 'app')
      }, {
        test: /\.styl$/,
        loaders: ['style', 'css?sourceMap', 'stylus?sourceMap'],
        exclude: /node_modules/
      }, {
        test: /\.(png|jpg|svg|gif|otf|ttf|woff|eot)$/,
        loaders: ['file'],
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'jwplayer': 'jwplayer'
  },
  stylus: {
    use: [ poststylus(['postcss-import', 'rucksack-css', 'autoprefixer']) ]
  }
};
