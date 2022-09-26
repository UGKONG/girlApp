/* eslint-disable no-path-concat */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '%': __dirname + '/hooks/',
      '~': __dirname + '/',
      '@': __dirname + '/',
    },
  },
  entry: __dirname + '/index.tsx',
  output: {
    path: __dirname + '/build',
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(avi|mp4|wav|webm)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {outputPath: './videos', name: '[name].[ext]'},
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|bmp|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {outputPath: './images', name: '[name].[ext]'},
          },
        ],
      },
      {
        test: /\.(txt|pdf|hwp|xlsx|ppt|doc)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {outputPath: './otherFile', name: '[name].[ext]'},
          },
        ],
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/i,
        use: ['html-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    open: true,
    hot: true,
    port: 9000,
  },
};
