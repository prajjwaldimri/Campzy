const path = require('path');

module.exports = {
  entry: { main: './frontend/src/index.js' },
  output: {
    path: path.resolve(__dirname, './frontend/dist'),
    filename: 'main.js',
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
    ],
  },
};
