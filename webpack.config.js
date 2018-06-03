//npx webpack --config webpack.config.js
var path = require('path');
//var nodeExternals = require('webpack-node-externals');
var DashboardPlugin = require('webpack-dashboard/plugin');
var WebpackJsObfuscator = require('webpack-obfuscator');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const rootPath = path.join(__dirname, '');
const HappyPack = require('happypack');
var webpack = require("webpack");
var buildMode = "production" //production //development
//const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: buildMode, //production //development
    target: 'web', // in order to ignore built-in modules like path, fs, etc. 
    externals: { // in order to ignore all modules to not be in compiled Package - client Bundle
        /*  jquery: 'jQuery',
         alasql: 'alasql',
         react: 'React',
         "react-dom": "ReactDOM",
         modernizr: "Modernizr",
         "react-table": "ReactTable" */
    },
    cache: true,
    entry: ['./client-app/src/init.js'],
    output: {
        path: rootPath,
        filename: "client-app/dist/client.bundle.js"
    },
    resolve: {
        alias: {

        },
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(buildMode)
        }),
        new HappyPack({
            loaders: ['babel-loader?presets[]=babel-preset-env'],
            threads: 20
        }),

        new DashboardPlugin(), new UglifyJsPlugin({
            cache: true,
            parallel: true,
            uglifyOptions: {
                ie8: false,
                ecma: 6,
                compress: true
            }
        }),
        new WebpackJsObfuscator({}, [])
    ],
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'happypack/loader',
                    options: {
                        presets: ['babel-preset-env'],
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
        ]
    }
};
