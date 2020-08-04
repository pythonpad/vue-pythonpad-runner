const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

module.exports = mode => ({
    cache: true,
    mode: 'development',
    entry: {
        'vue-pythonpad-runner.bundle': mode === 'development' ? ['babel-polyfill', './src/browser.js'] : ['./src/browser.js'],
    },
    output: {
        path: path.join(__dirname, 'lib'),
        publicPath: '/lib/',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.vue'],
        modules: ['node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [path.resolve(__dirname, 'src')],
                use: ['babel-loader'],
            },
            {
                test: /\.vue$/,
                include: [path.resolve(__dirname, 'src')],
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {}
                }]
            }
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        ...(mode === 'development' ? [new webpack.HotModuleReplacementPlugin()] : []),
    ],
    devServer: {
        hot: true,
        historyApiFallback: true,
        contentBase: '.',
        publicPath: '/lib/',
    },
});