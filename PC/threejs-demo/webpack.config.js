const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const glob = require('glob-all');

const parts = require('./webpack.parts');

// Paths
const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build'),
  common: path.join(__dirname, 'modules'),
  view: path.join(__dirname, 'views')
};

// Common configuration
const commonConfig = merge([
  {
    entry: PATHS.app + '/index.js',
    output: {
      path: PATHS.build,
      chunkFilename: 'js/[name].[chunkhash:8].js',
      filename: 'js/[name].[chunkhash:8].js'
    },
    resolve: {
      alias: {
        common: PATHS.common,
        confPath: PATHS.app,
        view: PATHS.view
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: PATHS.view + '/index.html'
      })
    ]
  }
]);

// Production configuration
const productionConfig = merge([
  parts.clean(PATHS.build),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      safe: true
    }
  }),
  parts.extractCss({
    use: ['css-loader', parts.autoprefixer()]
  }),
  parts.purifyCss({
    paths: glob.sync([PATHS.view + '/*.@(jsx|html)', PATHS.view + '/**/*.jsx'], {nodir: true})
  }),
  parts.loadImages({
    options: {
      limit: 1000,
      name: 'image/[name].[hash:8].[ext]',
      publicPath: '../'
    }
  }),
  parts.loadJavaScript({include: [PATHS.app, PATHS.view]}),
  {
    optimization: {
      splitChunks: {
        chunks: 'initial'
      }
    }
  },
  parts.minifyJavaScript(),
  parts.copyModels(PATHS.app, PATHS.build)
]);

// The development of the configuration
const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadCss(),
  parts.loadImages(),
  parts.loadJavaScript({include: [PATHS.app, PATHS.view]})
]);

// Run/package the configuration
module.exports = mode => {
  if (mode === 'production') {
    return merge(commonConfig, productionConfig, { mode });
  }

  return merge(commonConfig, developmentConfig, { mode });
}
