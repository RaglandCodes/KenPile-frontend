const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');

//default configs
var config = {
    entry: './src/index.js',
    devServer: {
        port: 2020,
        hot: true,
        publicPath: '/',
        historyApiFallback: true,
        watchContentBase: true,
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, './build'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'KenPile',
            filename: 'index.html',
            template: './src/index.html',
            //scriptLoading: 'defer',
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
