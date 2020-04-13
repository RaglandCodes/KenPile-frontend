const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

//default configs
var config = {
    entry: {
        landing: './src/index.js',
        login: './src/login/login.js',
        home: './src/home/home.js',
        note: './src/note/note.js',
    },
    devServer: {
        port: 2020,
        hot: true,
        publicPath: '/',
        watchContentBase: true,
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, './build'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['landing'],
            filename: 'index.html',
            template: './src/index.html',
        }),
        new HtmlWebpackPlugin({
            chunks: ['login'],
            filename: 'login.html',
            template: './src/login/login.html',
        }),
        new HtmlWebpackPlugin({
            chunks: ['home'],
            filename: 'home.html',
            template: './src/home/home.html',
        }),
        new HtmlWebpackPlugin({
            chunks: ['note'],
            filename: 'note.html',
            template: './src/note/note.html',
        }),
        new HtmlWebpackInlineSVGPlugin({
            runPreEmit: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                ],
            },
        ],
    },
    stats: 'errors-warnings',
};

module.exports = (env, argv) => {
    //override default configs with development specific configurations
    if (argv.mode === 'development') {
        config.devtool = 'inline-source-map';
    }

    //override default configs with production specific configurations
    if (argv.mode === 'production') {
        config.plugins = [...config.plugins, new CleanWebpackPlugin()];
        config.stats = 'verbose';
    }

    return config;
};
