const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/index.jsx',
  devtool: 'inline-source-map',
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
		  'style-loader',
		  'css-loader',
		]
      }
    ],
  },
  resolve: {
    extensions: ['.jsx', '.js', '.ts'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 8080,
    // enable HMR on the devServer
    hot: true,
    // match the output 'publicPath'
    // publicPath: '/dist/',
    // fallback to root for other urls
    historyApiFallback: true,
    // match the output path
    contentBase: path.resolve(__dirname, 'dist'),
    proxy: {
      '/login': 'http://localhost:3000',
      '/table': 'http://localhost:3000',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
    }),
  ],
};
