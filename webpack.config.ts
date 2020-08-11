const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './client/index.tsx',
    devtool: 'inline-source-map',
    mode: process.env.NODE_ENV,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        // enable HMR on the devServer
        hot: true,
        // match the output 'publicPath'
        publicPath: '/',
        // fallback to root for other urls
        historyApiFallback: true,
        // match the output path
        contentBase: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html'
        })
    ]
};