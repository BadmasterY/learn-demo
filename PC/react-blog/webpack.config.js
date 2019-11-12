const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const globAll = require('glob-all');

const parts = require('./webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

const commonConfig = merge([
    {
        entry: {
            app: PATHS.app + '/index.js'
        },
        output: {
            path: PATHS.build,
            filename: 'js/[name].[chunkhash:8].js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: PATHS.app + '/index.html'
            })
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        }
    }
]);

const productionConfig = merge([
    parts.clean(),
    parts.minifyCss({
        options: {
            discardComments: {
                removeAll: true
            },
            safe: true
        }
    }),
    parts.loadImages({
        options: {
            limit: 5000,
            name: 'iamges/[hash].[ext]',
            // publicPath: '../'
        }
    }),
    parts.purifyCss({
        paths: globAll.sync([`${PATHS.app}/*.html`, `${PATHS.app}/**/*.jsx`, `${PATHS.app}/**/*.js`], { nodir: true }),
        minimize: true
    }),
    parts.extractCss({
        use: ['css-loader', parts.autoprefixer()]
    }),
    parts.loadJavascript({ include: PATHS.app }),
    parts.minifyJavascript(),
    {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'chunk/vendor',
                        chunks: 'initial'
                    }
                }
            },
            runtimeChunk: {
                name: 'chunk/manifest'
            }
        }
    },
    parts.bundleAnalyzer()
]);

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
    }),
    parts.loadCss(),
    parts.loadImages(),
    parts.loadJavascript({ include: PATHS.app })
]);

module.exports = mode => {
    if (mode === 'production') {
        return merge(commonConfig, productionConfig, { mode });
    }
    return merge(commonConfig, developmentConfig, { mode });
}