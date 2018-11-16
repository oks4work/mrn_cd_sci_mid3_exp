const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development', // 'development': 개발, 'production': 생산(난독화)
    entry: {
        cannon: ['babel-polyfill', './src/js/cannon'],
        // fall: ['babel-polyfill', './src/js/fall']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './src/js/[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: [
                    ['env'],
                ],
            }
        }, {
            test: /\.less$/,
            use: [{
                loader: 'style-loader' // creates style nodes from JS strings
            }, {
                loader: 'css-loader', options: { // translates CSS into CommonJS
                    sourceMap: true
                }
            }, {
                loader: 'less-loader', options: { // compiles Less to CSS
                    sourceMap: true
                }
            }],
        }, {
            test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader',
            options: {
                name: '[path][hash].[ext]',
                limit: 1024, // 1024byte(1kb)
            }
        }],
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.css', 'less'],
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: './src/', to: '' }, // html 파일들
        ]),
    ]
};