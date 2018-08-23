const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: process.env.ENVIRONMENT,
  entry: { main: './frontend/src/index.js' },
  output: {
    path: path.resolve(__dirname, './frontend/dist'),
    filename: 'main.bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.pug/,
        use: ['pug-html-loader'],
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: 'vue-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin('frontend/dist', {}),
    new VueLoaderPlugin(),
    // eslint-disable-next-line
    require('autoprefixer'),
    new MiniCssExtractPlugin({ filename: 'style.css' }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './frontend/src/index.html',
    }),
  ],
};
