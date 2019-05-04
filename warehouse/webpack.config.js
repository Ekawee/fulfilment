const webpack = require('webpack');
const path = require('path');
const nodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const plugins = [
  new webpack.NamedModulesPlugin(),
  new nodemonPlugin(),
  new webpack.HotModuleReplacementPlugin(),
];

module.exports = {
  mode: 'development',
  devtool: false,
  externals: [
    nodeExternals(),
  ],
  name: 'server',
  plugins: plugins,
  target: 'node',
  entry: [path.resolve(path.join(__dirname, './src/index.js'))],
  output: {
    publicPath: './',
    path: path.resolve(__dirname, './build'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /node_modules(\/|\\)datauri(\/|\\)index\.js$/,
        loaders: ['shebang', 'babel']
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          babelrc: true,
        },
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: [ /\.png$/, /\.ttf$/ ],
        loader: require.resolve('url-loader'),
      },
    ],
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};
