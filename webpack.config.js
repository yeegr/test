const webpack = require('webpack'),
  path = require('path')

module.exports = {
  target: 'node',
  mode: 'development',
  devtool: 'source-map',
  entry: './src/root.js',
  output: {
    path: path.resolve(__dirname, 'dev'),
    filename: 'server.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: 'babel-loader',
        exclude: /node-modules/
      },
      {
        test: /\.(html|jpg|png)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'static/[name].[ext]'
          }
        }],
        exclude: /node_modules/
      }
    ]
  }
}