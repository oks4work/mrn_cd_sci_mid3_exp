const path = require('path'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production', // 'development': 개발, 'production': 생산(난독화)
    entry: {
        cannon: ['babel-polyfill', './src/js/cannon'],
        fall: ['babel-polyfill', './src/js/fall']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './src/js/[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                presets: [
                    ['env', {
                        targets: { node: 'current' } // 노드일 경우만
                    }],
                ],
            },
            exclude: ['/node_modules'],
        }, {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'],
        }, {
            test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader',
            options: {
                name: '[path][hash].[ext]',
                limit: 1024, // 1024byte(1kb)
            }
        }],
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.css'],
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: './src/html/', to: '' }, // html 파일들
        ]),
    ]
};